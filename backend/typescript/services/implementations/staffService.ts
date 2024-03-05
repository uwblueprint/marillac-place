import { PrismaClient } from "@prisma/client";
import * as firebaseAdmin from "firebase-admin";
import type { IStaffService, StaffDTO } from "../interfaces/staffService";
import {
  // UserDTO,
  CreateUserDTO,
  UpdateUserDTO,
} from "../interfaces/userService";
import logger from "../../utilities/logger";
import { getErrorMessage } from "../../utilities/errorUtils";

const Prisma = new PrismaClient();
const Logger = logger(__filename);

class StaffService implements IStaffService {
  async addStaff(
    userInfo: CreateUserDTO,
    isAdmin: boolean = false,
  ): Promise<StaffDTO> {
    try {
      const firebaseUser = await firebaseAdmin.auth().createUser({
        email: userInfo.email,
        password: userInfo.password,
      });

      try {
        const newStaff = await Prisma.staff.create({
          data: {
            isAdmin,
            user: {
              create: {
                authId: firebaseUser.uid,
                id: userInfo.id ? Number(userInfo.id) : undefined,
                type: "STAFF",
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
          userId: newStaff.userId,
          isAdmin: newStaff.isAdmin,
          type: newStaff.user.type,
          email: firebaseUser.email ?? "",
          phoneNumber: newStaff.user.phoneNumber,
          firstName: newStaff.user.firstName,
          lastName: newStaff.user.lastName,
          displayName: newStaff.user.displayName,
          profilePictureURL: newStaff.user.profilePictureURL,
          isActive: newStaff.user.isActive,
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

  async updateStaff(
    staffId: number,
    userInfo: UpdateUserDTO,
    isAdmin: boolean = false,
  ): Promise<StaffDTO> {
    try {
      const oldStaff = await Prisma.staff.findUnique({
        where: { userId: staffId },
        include: { user: true },
      });

      if (!oldStaff) {
        throw new Error(`staff ${staffId} not found.`);
      }

      const updatedStaff = await Prisma.staff.update({
        where: { userId: staffId },
        data: {
          isAdmin,
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

      const { authId } = updatedStaff.user;

      try {
        if ("password" in userInfo) {
          await firebaseAdmin.auth().updateUser(authId, {
            email: updatedStaff.user.email,
            password: userInfo.password,
          });
        } else {
          await firebaseAdmin
            .auth()
            .updateUser(authId, { email: updatedStaff.user.email });
        }
      } catch (error) {
        try {
          await Prisma.staff.update({
            where: { userId: staffId },
            data: {
              isAdmin: oldStaff.isAdmin,
              user: {
                update: {
                  data: { ...oldStaff.user },
                },
              },
            },
          });
        } catch (postgresError: unknown) {
          const errorMessage = [
            "Failed to rollback Postgres user update after Firebase user update failure. Reason =",
            getErrorMessage(postgresError),
            "Postgres user id with possibly inconsistent data =",
            staffId,
          ];
          Logger.error(errorMessage.join(" "));
        }

        throw new Error(`failed to update firebase: ${error}`);
      }

      return {
        userId: updatedStaff.userId,
        isAdmin: updatedStaff.isAdmin,
        type: updatedStaff.user.type,
        email: updatedStaff.user.email,
        phoneNumber: updatedStaff.user.phoneNumber,
        firstName: updatedStaff.user.firstName,
        lastName: updatedStaff.user.lastName,
        displayName: updatedStaff.user.displayName,
        profilePictureURL: updatedStaff.user.profilePictureURL,
        isActive: updatedStaff.user.isActive,
      };
    } catch (error) {
      Logger.error(
        `Failed to update staff #${staffId} because ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async deleteStaff(staffId: number): Promise<StaffDTO> {
    try {
      const deletedUser = await Prisma.user.findUnique({
        where: { id: staffId },
        include: { staff: true },
      });

      if (!deletedUser) {
        throw new Error(`staff ${staffId} not found.`);
      }

      const deletedStaff = await Prisma.staff.delete({
        where: { userId: staffId },
        include: { user: true },
      });
      
      try {
        await firebaseAdmin.auth().deleteUser(deletedUser.authId);
      } catch (error) {
        try {
          await Prisma.staff.create({
            data: {
              isAdmin: deletedStaff.isAdmin,
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
        userId: deletedStaff.userId,
        isAdmin: deletedStaff.isAdmin,
        type: deletedUser.type,
        email: deletedUser.email,
        phoneNumber: deletedUser.phoneNumber,
        firstName: deletedUser.firstName,
        lastName: deletedUser.lastName,
        displayName: deletedUser.displayName,
        profilePictureURL: deletedUser.profilePictureURL,
        isActive: deletedUser.isActive,
      };
    } catch (error) {
      Logger.error(
        `Failed to delete staff #${staffId} because ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async getAllStaff(): Promise<Array<StaffDTO>> {
    try {
      const allStaff = await Prisma.staff.findMany({
        include: { user: true },
      });

      return allStaff.map((staff) => {
        return {
          userId: staff.userId,
          isAdmin: staff.isAdmin,
          type: staff.user.type,
          email: staff.user.email,
          phoneNumber: staff.user.phoneNumber,
          firstName: staff.user.firstName,
          lastName: staff.user.lastName,
          displayName: staff.user.displayName,
          profilePictureURL: staff.user.profilePictureURL,
          isActive: staff.user.isActive,
        };
      });
    } catch (error: unknown) {
      Logger.error(`Failed to get all Staff because ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async getStaffByIds(staffIds: number[]): Promise<Array<StaffDTO>> {
    try {
      const getStaffById = await Prisma.staff.findMany({
        where: { userId: { in: staffIds } },
        include: { user: true },
      });

      return getStaffById.map((staff) => {
        return {
          userId: staff.userId,
          isAdmin: staff.isAdmin,
          type: staff.user.type,
          email: staff.user.email,
          phoneNumber: staff.user.phoneNumber,
          firstName: staff.user.firstName,
          lastName: staff.user.lastName,
          displayName: staff.user.displayName,
          profilePictureURL: staff.user.profilePictureURL,
          isActive: staff.user.isActive,
        };
      });
    } catch (error: unknown) {
      Logger.error(
        `Failed to get staff by IDs. IDs = ${staffIds} because ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }
}

export default StaffService;
