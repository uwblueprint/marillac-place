import * as firebaseAdmin from "firebase-admin";

import prisma, { UserType } from "../../prisma";
import IUserService, { SimplifiedUserDTO } from "../interfaces/userService";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";

const Logger = logger(__filename);

class UserService implements IUserService {
  async getUserByEmail(email: string): Promise<SimplifiedUserDTO> {
    try {
      const firebaseUser = await firebaseAdmin.auth().getUserByEmail(email);
      const user = await prisma.user.findUnique({
        where: { authId: firebaseUser.uid },
      });
      if (!user) {
        throw new Error(`userId with authID ${firebaseUser.uid} not found.`);
      }
      return {
        id: user.id,
        type: user.type,
        email: firebaseUser.email ?? "",
        firstName: user.firstName,
        lastName: user.lastName,
      };
    } catch (error: unknown) {
      Logger.error(`Failed to get user. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async getUserIdByAuthId(authId: string): Promise<string> {
    try {
      const user = await prisma.user.findUnique({
        where: { authId },
      });
      if (!user) {
        throw new Error(`user with authId ${authId} not found.`);
      }
      return String(user.id);
    } catch (error: unknown) {
      Logger.error(`Failed to get user id. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async getAuthIdById(userId: string): Promise<string> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: Number(userId) },
      });
      if (!user) {
        throw new Error(`userId ${userId} not found.`);
      }
      return user.authId;
    } catch (error: unknown) {
      Logger.error(`Failed to get authId. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async getUserTypeByAuthId(authId: string): Promise<UserType> {
    try {
      const user = await prisma.user.findUnique({
        where: { authId },
      });
      if (!user) {
        throw new Error(`userId with authId ${authId} not found.`);
      }
      return user.type;
    } catch (error: unknown) {
      Logger.error(
        `Failed to get user role. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async setUserInactive(userId: number): Promise<void> {
    try {
      const user = await prisma.user.update({
        where: { 
          id: userId,
        },
        data: {
          isActive: false
        }
      });

      if (!user) {
        throw new Error(`User with userId ${userId} not found.`);
      }
    } catch (error: unknown) {
      Logger.error(
        `Failed to set user inactive. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }
}

export default UserService;
