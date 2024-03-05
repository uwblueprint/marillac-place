import { PrismaClient } from "@prisma/client";
import * as firebaseAdmin from "firebase-admin";
import {
  IResidentService,
  ResidentDTO,
  // CreateResidentDTO,
  // UpdateResidentDTO,
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
    residentId: number,
    birthDate: string,
    roomNumber: number,
  ): Promise<ResidentDTO> {
    try {
      const firebaseUser = await firebaseAdmin.auth().createUser({
        email: userInfo.email,
        password: userInfo.password,
      });

      try {
        const newResident = await Prisma.resident.create({
          data: {
            residentId,
            birthDate,
            roomNumber,
            user: {
              create: {
                authId: firebaseUser.uid,
                id: userInfo.id,
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
      Logger.error(`Failed to create staff because ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async getResidentAuthId(residentId: number): Promise<string> {
    try {
      const user = await Prisma.user.findUnique({
        where: { residentId },
      });

      if (!user) {
        throw new Error(`staff ${residentId} not found.`);
      }
      return user.authId;
    } catch (error: unknown) {
      Logger.error(`Failed to get authId. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async updateResident(
    userInfo: UpdateUserDTO,
    residentId: number,
    birthDate: string,
    roomNumber: number,
  ): Promise<ResidentDTO> {
    try {
      const updatedResident = await Prisma.resident.update({
        where: { userId: residentId },
        data: {
          residentId,
          birthDate,
          roomNumber,
          ...userInfo,
        },
        include: { user: true },
      });

      const authId = await this.getResidentAuthId(residentId);
      const [oldResident] = await this.getResidentsById([residentId]);

      try {
        await firebaseAdmin
          .auth()
          .updateUser(authId, { email: userInfo.email });
      } catch (error) {
        try {
          await Prisma.resident.update({
            where: { userId: residentId },
            data: {
              ...oldResident,
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
      };
    } catch (error) {
      Logger.error(
        `Failed to update staff #${residentId} because ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }

  async deleteResident(residentId: number): Promise<ResidentDTO> {
    try {
      const deleteResident = await Prisma.resident.delete({
        where: { userId: residentId },
      });

      const deletedUser = await Prisma.user.delete({
        where: { id: residentId },
      });

      const [authId] = await this.getResidentAuthId(residentId);
      try {
        await firebaseAdmin.auth().deleteUser(authId);
      } catch (error) {
        try {
          await Prisma.resident.create({
            data: {
              residentId: deleteResident.residentId,
              birthDate: deleteResident.birthDate,
              roomNumber: deleteResident.roomNumber,
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
            authId,
          ];
          Logger.error(errorMessage.join(" "));
        }
      }

      return {
        userId: deleteResident.userId,
        residentId: deleteResident.residentId,
        birthDate: deleteResident.birthDate,
        roomNumber: deleteResident.roomNumber,
        credits: deleteResident.credits,
        dateJoined: deleteResident.dateJoined,
        dateLeft: deleteResident.dateLeft,
        notes: deleteResident.notes,
      };
    } catch (error) {
      Logger.error(
        `Failed to delete staff #${residentId} because ${getErrorMessage(
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
