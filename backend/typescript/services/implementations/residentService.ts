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
                id: userInfo.id ? Number(userInfo.id) : undefined,
                type: "RESIDENT",
                email: userInfo.email,
                phoneNumber: userInfo.phoneNumber,
                firstName: userInfo.firstName,
                lastName: userInfo.lastName,
                displayName: userInfo.displayName,
                profilePictureURL: userInfo.profilePictureURL,
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

  async getResidentAuthId(residentId: number): Promise<string> {
    try {
      const user = await Prisma.user.findUnique({
        where: { residentId },
      });

      if (!user) {
        throw new Error(`resident ${residentId} not found.`);
      }
      return user.authId;
    } catch (error: unknown) {
      Logger.error(`Failed to get authId. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async updateResident(
    residentId: number,
    userInfo: UpdateUserDTO,
    resident: UpdateResidentDTO,
  ): Promise<ResidentDTO> {
    try {
      const oldResident = await Prisma.resident.findUnique({
        where: { userId: residentId },
        include: { user: true },
      });

      if (!oldResident) {
        throw new Error(`resident ${residentId} not found.`);
      }
      const updatedResident = await Prisma.resident.update({
        where: { userId: residentId },
        data: {
          residentId: resident.residentId,
          birthDate: resident.birthDate,
          roomNumber: resident.roomNumber,
          credits: resident.credits,
          dateJoined: resident.dateJoined,
          dateLeft: resident.dateLeft,
          notes: resident.notes,
          user: {
            update: {
              data: {
                email: userInfo.email,
                phoneNumber: userInfo.phoneNumber,
                firstName: userInfo.firstName,
                lastName: userInfo.lastName,
                displayName: userInfo.displayName,
                profilePictureURL: userInfo.profilePictureURL,
              },
            },
          },
        },
        include: { user: true },
      });

      const { authId } = updatedResident.user;
      try {
        if ("password" in userInfo) {
          await firebaseAdmin.auth().updateUser(authId, {
            email: updatedResident.user.email,
            password: userInfo.password,
          });
        } else {
          await firebaseAdmin
            .auth()
            .updateUser(authId, { email: updatedResident.user.email });
        }
      } catch (error) {
        try {
          await Prisma.resident.update({
            where: { userId: residentId },
            data: {
              residentId: oldResident.residentId,
              birthDate: oldResident.birthDate,
              roomNumber: oldResident.roomNumber,
              credits: oldResident.credits,
              dateJoined: oldResident.dateJoined,
              dateLeft: oldResident.dateLeft,
              notes: oldResident.notes,
              user: {
                update: {
                  data: { ...oldResident.user },
                },
              },
            },
          });
        } catch (postgresError: unknown) {
          const errorMessage = [
            "Failed to rollback Postgres user update after Firebase user update failure. Reason =",
            getErrorMessage(postgresError),
            "Postgres user id with possibly inconsistent data =",
            residentId,
          ];
          Logger.error(errorMessage.join(" "));
        }

        throw new Error(`failed to update firebase: ${error}`);
      }

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
        include: { resident: true },
      });

      if (!deletedUser) {
        throw new Error(`resident ${residentId} not found.`);
      }

      const deletedResident = await Prisma.resident.delete({
        where: { userId: residentId },
        include: { user: true },
      });
      try {
        await firebaseAdmin.auth().deleteUser(deletedUser.authId);
      } catch (error) {
        try {
          await Prisma.resident.create({
            data: {
              residentId: deletedResident.residentId,
              birthDate: deletedResident.birthDate,
              roomNumber: deletedResident.roomNumber,
              credits: deletedResident.credits,
              dateJoined: deletedResident.dateJoined,
              dateLeft: deletedResident.dateLeft,
              notes: deletedResident.notes,
              user: {
                create: {
                  ...deletedUser,
                },
              },
            },
          });
        } catch (postgresError: unknown) {
          const errorMessage = [
            "Failed to rollback Postgres user deletion after Firebase user deletion failure. Reason =",
            getErrorMessage(postgresError),
            "Firebase uid with non-existent Postgres record =",
            deletedUser.authId,
          ];
          Logger.error(errorMessage.join(" "));
        }
      }
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
