import { PrismaClient } from "@prisma/client";
import * as firebaseAdmin from "firebase-admin";
import {
  IResidentService,
  ResidentDTO,
  CreateResidentDTO,
  UpdateResidentDTO,
  RedeemCreditsResponse,
} from "../interfaces/residentService";
import logger from "../../utilities/logger";
import { getErrorMessage } from "../../utilities/errorUtils";
import {
  // UserDTO,
  CreateUserDTO,
  UpdateUserDTO,
} from "../interfaces/userService";

const Prisma = new PrismaClient();
const Logger = logger(__filename);

class ResidentService implements IResidentService {
  async addResident(
    userInfo: CreateUserDTO,
    resident: CreateResidentDTO,
  ): Promise<ResidentDTO> {
    try {
      const firebaseUser = await firebaseAdmin.auth().createUser({
        email: userInfo.email,
        password: userInfo.password,
      });

      try {
        const newResident = await Prisma.resident.create({
          data: {
            residentId: resident.residentId,
            birthDate: resident.birthDate,
            roomNumber: resident.roomNumber,
            credits: resident.credits,
            dateJoined: resident.dateJoined,
            dateLeft: resident.dateLeft,
            notes: resident.notes,
            user: {
              create: {
                authId: firebaseUser.uid,
                type: "RESIDENT",
                email: userInfo.email,
                phoneNumber: userInfo.phoneNumber,
                firstName: userInfo.firstName,
                lastName: userInfo.lastName,
                displayName: userInfo.displayName,
                profilePictureURL: userInfo.profilePictureURL,
                isActive: true,
              },
            },
          },
          include: { user: true },
        });

        return {
          userId: newResident.userId,
          residentId: newResident.residentId,
          birthDate: newResident.birthDate,
          roomNumber: newResident.roomNumber,
          credits: newResident.credits,
          dateJoined: newResident.dateJoined,
          dateLeft: newResident.dateLeft,
          notes: newResident.notes,
          type: newResident.user.type,
          email: newResident.user.email,
          phoneNumber: newResident.user.phoneNumber,
          firstName: newResident.user.firstName,
          lastName: newResident.user.lastName,
          displayName: newResident.user.displayName,
          profilePictureURL: newResident.user.profilePictureURL,
          isActive: newResident.user.isActive,
        };
      } catch (postgresError) {
        try {
          await firebaseAdmin.auth().deleteUser(firebaseUser.uid);
        } catch (firebaseError: unknown) {
          const errorMessage = [
            "Failed to rollback Firebase user creation after Postgres user creation failure. Reason =",
            getErrorMessage(firebaseError),
            "Orphaned authId (Firebase uid) =",
            firebaseUser.uid,
          ];
          Logger.error(errorMessage.join(" "));
        }

        throw postgresError;
      }
    } catch (error) {
      Logger.error(
        `Failed to create resident because ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async updateResident(
    residentId: number,
    userInfo: UpdateUserDTO,
    resident: UpdateResidentDTO,
  ): Promise<ResidentDTO> {
    try {
      const oldUser = await Prisma.user.findUnique({
        where: { id: residentId },
      });

      if (!oldUser) {
        throw new Error(`resident ${residentId} not found.`);
      }

      if (oldUser.type !== "RESIDENT") {
        throw new Error(`${residentId} is not a resident.`);
      }

      const { authId } = oldUser;
      const email = "email" in userInfo ? userInfo.email : oldUser.email;

      if ("password" in userInfo) {
        await firebaseAdmin.auth().updateUser(authId, {
          email,
          password: userInfo.password,
        });
      } else {
        await firebaseAdmin.auth().updateUser(authId, { email });
      }

      const updatedResident = await Prisma.resident.update({
        where: { userId: residentId },
        data: {
          residentId: resident.residentId || undefined,
          birthDate: resident.birthDate || undefined,
          roomNumber: resident.roomNumber || undefined,
          credits: resident.credits || undefined,
          dateJoined: resident.dateJoined || undefined,
          dateLeft: resident.dateLeft || undefined,
          notes: resident.notes || undefined,
          user: {
            update: {
              data: {
                email: userInfo.email || undefined,
                phoneNumber: userInfo.phoneNumber || undefined,
                firstName: userInfo.firstName || undefined,
                lastName: userInfo.lastName || undefined,
                displayName: userInfo.displayName || undefined,
                profilePictureURL: userInfo.profilePictureURL || undefined,
                isActive: userInfo.isActive || undefined,
              },
            },
          },
        },
        include: { user: true },
      });

      return {
        userId: updatedResident.userId,
        residentId: updatedResident.residentId,
        birthDate: updatedResident.birthDate,
        roomNumber: updatedResident.roomNumber,
        credits: updatedResident.credits,
        dateJoined: updatedResident.dateJoined,
        dateLeft: updatedResident.dateLeft,
        notes: updatedResident.notes,
        type: updatedResident.user.type,
        email: updatedResident.user.email,
        phoneNumber: updatedResident.user.phoneNumber,
        firstName: updatedResident.user.firstName,
        lastName: updatedResident.user.lastName,
        displayName: updatedResident.user.displayName,
        profilePictureURL: updatedResident.user.profilePictureURL,
        isActive: updatedResident.user.isActive,
      };
    } catch (error) {
      Logger.error(
        `Failed to update resident #${residentId} because ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }

  async deleteResident(residentId: number): Promise<ResidentDTO> {
    try {
      const deletedUser = await Prisma.user.findUnique({
        where: { id: residentId },
      });

      if (!deletedUser) {
        throw new Error(`resident ${residentId} not found.`);
      }

      if (deletedUser.type !== "RESIDENT") {
        throw new Error(`${residentId} is not a resident.`);
      }

      await firebaseAdmin.auth().deleteUser(deletedUser.authId);

      const deletedResident = await Prisma.resident.delete({
        where: { userId: residentId },
        include: { user: true },
      });

      await Prisma.user.delete({
        where: { id: residentId },
      });

      return {
        userId: deletedResident.userId,
        residentId: deletedResident.residentId,
        birthDate: deletedResident.birthDate,
        roomNumber: deletedResident.roomNumber,
        credits: deletedResident.credits,
        dateJoined: deletedResident.dateJoined,
        dateLeft: deletedResident.dateLeft,
        notes: deletedResident.notes,
        type: deletedResident.user.type,
        email: deletedResident.user.email,
        phoneNumber: deletedResident.user.phoneNumber,
        firstName: deletedResident.user.firstName,
        lastName: deletedResident.user.lastName,
        displayName: deletedResident.user.displayName,
        profilePictureURL: deletedResident.user.profilePictureURL,
        isActive: deletedResident.user.isActive,
      };
    } catch (error) {
      Logger.error(
        `Failed to delete resident #${residentId} because ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }

  async getAllResidents(): Promise<ResidentDTO[]> {
    try {
      const allResidents = await Prisma.resident.findMany({
        include: { user: true },
      });
      return allResidents.map((resident) => {
        return {
          userId: resident.userId,
          residentId: resident.residentId,
          birthDate: resident.birthDate,
          roomNumber: resident.roomNumber,
          credits: resident.credits,
          dateJoined: resident.dateJoined,
          dateLeft: resident.dateLeft,
          notes: resident.notes,
          type: resident.user.type,
          email: resident.user.email,
          phoneNumber: resident.user.phoneNumber,
          firstName: resident.user.firstName,
          lastName: resident.user.lastName,
          displayName: resident.user.displayName,
          profilePictureURL: resident.user.profilePictureURL,
          isActive: resident.user.isActive,
        };
      });
    } catch (error: unknown) {
      Logger.error(
        `Failed to get all residents. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async getResidentsById(residentId: number[]): Promise<ResidentDTO[]> {
    try {
      const getResidentById = await Prisma.resident.findMany({
        where: { residentId: { in: residentId } },
        include: { user: true },
      });
      return getResidentById.map((resident) => {
        return {
          userId: resident.userId,
          residentId: resident.residentId,
          birthDate: resident.birthDate,
          roomNumber: resident.roomNumber,
          credits: resident.credits,
          dateJoined: resident.dateJoined,
          dateLeft: resident.dateLeft,
          notes: resident.notes,
          type: resident.user.type,
          email: resident.user.email,
          phoneNumber: resident.user.phoneNumber,
          firstName: resident.user.firstName,
          lastName: resident.user.lastName,
          displayName: resident.user.displayName,
          profilePictureURL: resident.user.profilePictureURL,
          isActive: resident.user.isActive,
        };
      });
    } catch (error: unknown) {
      Logger.error(
        `Failed to get residents by IDs. IDs = ${residentId}. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }

  async getActiveResidents(): Promise<ResidentDTO[]> {
    try {
      const residents = await Prisma.resident.findMany({
        where: {
          dateLeft: null,
        },
        include: { user: true },
      });

      if (!residents) throw new Error(`No residents found.`);

      return residents.map((resident) => {
        return {
          userId: resident.userId,
          residentId: resident.residentId,
          birthDate: resident.birthDate,
          roomNumber: resident.roomNumber,
          credits: resident.credits,
          dateJoined: resident.dateJoined,
          dateLeft: resident.dateLeft,
          notes: resident.notes,
          type: resident.user.type,
          email: resident.user.email,
          phoneNumber: resident.user.phoneNumber,
          firstName: resident.user.firstName,
          lastName: resident.user.lastName,
          displayName: resident.user.displayName,
          profilePictureURL: resident.user.profilePictureURL,
          isActive: resident.user.isActive,
        };
      });
    } catch (error: unknown) {
      Logger.error(
        `Failed to get all active residents. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }

  async redeemCredits(
    residentId: number,
    credits: number,
  ): Promise<RedeemCreditsResponse> {
    try {
      const currentCredits = await Prisma.resident.findUnique({
        where: { residentId },
        select: {
          credits: true,
        },
      });

      if (!currentCredits) {
        return RedeemCreditsResponse.INVALID_ID;
      }
      if (currentCredits.credits >= credits) {
        await Prisma.resident.update({
          where: { residentId },
          data: {
            credits: {
              decrement: credits,
            },
          },
        });
        return RedeemCreditsResponse.SUCCESS;
      }
      return RedeemCreditsResponse.NOT_ENOUGH_CREDITS;
    } catch (error: unknown) {
      Logger.error(
        `Failed to redeem resident's credits by IDs. IDs = ${residentId}. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }
}

export default ResidentService;
