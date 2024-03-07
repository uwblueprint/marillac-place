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
      const originalUser = await Prisma.user.findUnique({
        where: { id: staffId },
      });

      if (!originalUser) {
        throw new Error(`staff ${staffId} not found.`);
      }

      const { authId } = originalUser;
      const email = "email" in userInfo ? userInfo.email : originalUser.email;

      if ("password" in userInfo) {
        await firebaseAdmin.auth().updateUser(authId, {
          email,
          password: userInfo.password,
        });
      } else {
        await firebaseAdmin.auth().updateUser(authId, { email });
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
        include: {
          user: true,
        },
      });

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
      });

      if (!deletedUser) {
        throw new Error(`staff ${staffId} not found.`);
      }

      await firebaseAdmin.auth().deleteUser(deletedUser.authId);

      const deletedStaff = await Prisma.staff.delete({
        where: { userId: staffId },
        include: { user: true },
      });

      await Prisma.user.delete({
        where: { id: staffId },
      });

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
        include: {
          user: true,
          // user: {
          //   include: {
          //     tasksAssigned: true,
          //     warningsAssigned: true
          //   }
          // }
          // notificationsReceived: true,
          // notificationsSent: true
        },
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
          // notificationsReceived: staff.notificationsReceived,
          // notificationsSent: staff.notificationsSent,
          // warningsAssigned: staff.user.warningsAssigned,
          // tasksAssigned: staff.user.tasksAssigned,
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
        include: {
          user: true,
          // user: {
          //   include: {
          //     tasksAssigned: true,
          //     warningsAssigned: true
          //   }
          // }
          // notificationsReceived: true,
          // notificationsSent: true
        },
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
          // notificationsReceived: staff.notificationsReceived,
          // notificationsSent: staff.notificationsSent,
          // warningsAssigned: staff.user.warningsAssigned,
          // tasksAssigned: staff.user.tasksAssigned,
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
