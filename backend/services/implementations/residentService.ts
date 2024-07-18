import * as firebaseAdmin from "firebase-admin";

import prisma, { UserType } from "../../prisma";
import IResidentService, {
  ResidentDTO,
  CreateResidentDTO,
  UpdateResidentDTO,
  RedeemCreditsResponse,
} from "../interfaces/residentService";
import IUserService from "../interfaces/userService";
import logger from "../../utilities/logger";
import { getErrorMessage } from "../../utilities/errorUtils";

const Logger = logger(__filename);

class ResidentService implements IResidentService {
  userService: IUserService;

  constructor(
    userService: IUserService,
  ) {
    this.userService = userService;
  }

  async addResident(resident: CreateResidentDTO): Promise<ResidentDTO> {
    try {
      const firebaseUser = await firebaseAdmin.auth().createUser({
        email: resident.email,
        password: resident.password,
      });

      try {
        const newResident = await prisma.resident.create({
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
                type: UserType.RESIDENT,
                email: resident.email,
                phoneNumber: resident.phoneNumber,
                firstName: resident.firstName,
                lastName: resident.lastName,
                displayName: resident.displayName,
                profilePictureURL: resident.profilePictureURL,
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
    userId: number,
    resident: UpdateResidentDTO,
  ): Promise<ResidentDTO> {
    try {
      const oldUser = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!oldUser) {
        throw new Error(`resident ${userId} not found.`);
      }

      if (oldUser.type !== UserType.RESIDENT) {
        throw new Error(`${userId} is not a resident.`);
      }

      const { authId } = oldUser;
      const email = "email" in resident ? resident.email : oldUser.email;

      if ("password" in resident) {
        await firebaseAdmin.auth().updateUser(authId, {
          email,
          password: resident.password,
        });
      } else {
        await firebaseAdmin.auth().updateUser(authId, { email });
      }

      const updatedResident = await prisma.resident.update({
        where: { userId },
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
                email: resident.email || undefined,
                phoneNumber: resident.phoneNumber || undefined,
                firstName: resident.firstName || undefined,
                lastName: resident.lastName || undefined,
                displayName: resident.displayName || undefined,
                profilePictureURL: resident.profilePictureURL || undefined,
                isActive: resident.isActive || undefined,
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
        `Failed to update resident #${userId} because ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }

  async deleteResident(userId: number): Promise<ResidentDTO> {
    try {
      const deletedUser = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!deletedUser) {
        throw new Error(`resident ${userId} not found.`);
      }

      if (deletedUser.type !== UserType.RESIDENT) {
        throw new Error(`${userId} is not a resident.`);
      }

      await firebaseAdmin.auth().deleteUser(deletedUser.authId);

      const deletedResident = await prisma.resident.delete({
        where: { userId },
        include: { user: true },
      });

      await prisma.user.delete({
        where: { id: userId },
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
        `Failed to delete resident #${userId} because ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }

  async getAllResidents(): Promise<ResidentDTO[]> {
    try {
      const allResidents = await prisma.resident.findMany({
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

  async getResidentsByIds(userId: number[]): Promise<ResidentDTO[]> {
    try {
      const getResidentById = await prisma.resident.findMany({
        where: { userId: { in: userId } },
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
        `Failed to get residents by IDs. IDs = ${userId}. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }

  async getActiveResidents(): Promise<ResidentDTO[]> {
    try {
      const residents = await prisma.resident.findMany({
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
    userId: number,
    credits: number,
  ): Promise<RedeemCreditsResponse> {
    try {
      const currentCredits = await prisma.resident.findUnique({
        where: { userId },
        select: {
          credits: true,
        },
      });

      if (!currentCredits) {
        return RedeemCreditsResponse.INVALID_ID;
      }
      if (currentCredits.credits >= credits) {
        await prisma.resident.update({
          where: { userId },
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
        `Failed to redeem resident's credits by IDs. IDs = ${userId}. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }

  async setResidentInactive(userId: number): Promise<ResidentDTO> {
    try {
      const resident = await prisma.resident.findUnique({
        where: {userId: userId,},
        include: { user: true },
      });

      if(!resident) {
        throw new Error(`Resident with ${userId} not found.`);
      }

      this.userService.setUserInactive(userId);

      return {
        userId: resident.userId,
        residentId: resident.residentId,
        birthDate: resident.birthDate,
        roomNumber: resident.roomNumber,
        credits: resident.credits,
        dateJoined: resident.dateJoined,
        dateLeft: resident.dateLeft,
        notes: resident.notes,
        email: resident.user.email,
        phoneNumber: resident.user.phoneNumber,
        firstName: resident.user.firstName,
        lastName: resident.user.lastName,
        displayName: resident.user.displayName,
        profilePictureURL: resident.user.profilePictureURL,
        isActive: false,
      };
    } catch (error: unknown) {
      Logger.error(`Failed to set resident inactive. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }
}

export default ResidentService;
