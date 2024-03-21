import * as firebaseAdmin from "firebase-admin";

import prisma, { UserType } from "../../prisma";
import IStaffService, {
  StaffDTO,
  CreateStaffDTO,
  UpdateStaffDTO,
} from "../interfaces/staffService";
import logger from "../../utilities/logger";
import { getErrorMessage } from "../../utilities/errorUtils";

const Logger = logger(__filename);

class StaffService implements IStaffService {
  async addStaff(staff: CreateStaffDTO): Promise<StaffDTO> {
    try {
      const firebaseUser = await firebaseAdmin.auth().createUser({
        email: staff.email,
        password: staff.password,
      });

      try {
        const newStaff = await prisma.staff.create({
          data: {
            isAdmin: staff.isAdmin,
            user: {
              create: {
                authId: firebaseUser.uid,
                type: UserType.STAFF,
                email: staff.email,
                phoneNumber: staff.phoneNumber,
                firstName: staff.firstName,
                lastName: staff.lastName,
                displayName: staff.displayName,
                profilePictureURL: staff.profilePictureURL,
              },
            },
          },
          include: { user: true },
        });

        return {
          userId: newStaff.userId,
          isAdmin: newStaff.isAdmin,
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
    staff: UpdateStaffDTO,
    isAdmin: boolean = false,
  ): Promise<StaffDTO> {
    try {
      const originalUser = await prisma.user.findUnique({
        where: { id: staffId },
      });

      if (!originalUser) {
        throw new Error(`staff ${staffId} not found.`);
      } else if (originalUser.type !== UserType.STAFF) {
        throw new Error(`id ${staffId} is not a staff.`);
      }

      const { authId } = originalUser;
      const email = "email" in staff ? staff.email : originalUser.email;

      if ("password" in staff) {
        await firebaseAdmin.auth().updateUser(authId, {
          email,
          password: staff.password,
        });
      } else {
        await firebaseAdmin.auth().updateUser(authId, { email });
      }

      const updatedStaff = await prisma.staff.update({
        where: { userId: staffId },
        data: {
          isAdmin,
          user: {
            update: {
              data: {
                email: staff.email,
                phoneNumber: staff.phoneNumber,
                firstName: staff.firstName,
                lastName: staff.lastName,
                displayName: staff.displayName,
                profilePictureURL: staff.profilePictureURL,
                isActive: staff.isActive,
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
      const deletedUser = await prisma.user.findUnique({
        where: { id: staffId },
      });

      if (!deletedUser) {
        throw new Error(`staff ${staffId} not found.`);
      } else if (deletedUser.type !== UserType.STAFF) {
        throw new Error(`id ${staffId} is not a staff.`);
      }

      await firebaseAdmin.auth().deleteUser(deletedUser.authId);

      const deletedStaff = await prisma.staff.delete({
        where: { userId: staffId },
        include: { user: true },
      });

      await prisma.user.delete({
        where: { id: staffId },
      });

      return {
        userId: deletedStaff.userId,
        isAdmin: deletedStaff.isAdmin,
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
      const allStaff = await prisma.staff.findMany({
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
      const getStaffById = await prisma.staff.findMany({
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
