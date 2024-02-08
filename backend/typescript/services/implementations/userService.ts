import Prisma from "../../prisma";
import * as firebaseAdmin from "firebase-admin";
import { IUserService, UserDTO, CreateUserDTO, UpdateUserDTO } from "../interfaces/userService";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";

const Logger = logger(__filename);

class UserService implements IUserService {
  /* eslint-disable class-methods-use-this */

  async createUser ( 
    user: CreateUserDTO ,
    authId?: string,
    ): Promise<UserDTO> {
    let newUser;
    let firebaseUser: firebaseAdmin.auth.UserRecord;

    try {
      firebaseUser = await firebaseAdmin.auth().createUser({
        email: user.email,
        password: user.password,
      });
      
      try {
        newUser = await Prisma.user.create({
          data: {
            authId: firebaseUser.uid,
            type: user.type, 
            email: user.email,
            phoneNumber: user.phoneNumber,
            firstName: user.firstName,
            lastName: user.lastName,
            displayName: user.displayName,
            profilePictureURL: user.profilePictureURL,
          },
          // include: {}
        });
      } catch (postgresError) {
        try {
          await firebaseAdmin.auth().deleteUser(firebaseUser.uid);
        } catch (firebaseError) {
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
      Logger.error(`Failed to create user. Reason = ${getErrorMessage(error)}`);
      throw error;
    }

    return newUser; 
  }

  async getUserById(userId: number): Promise<UserDTO> {
    let user; 
    let firebaseUser: firebaseAdmin.auth.UserRecord;

    try {
      user = await Prisma.user.findUnique({
        where: { id: Number(userId) }
      });

      if (!user) { throw new Error(`userId ${userId} not found.`); }

      firebaseUser = await firebaseAdmin.auth().getUser(user.authId);
    } catch (error: unknown) {
      Logger.error(`Failed to get user. Reason = ${getErrorMessage(error)}`);
      throw error;
    }

    return {
      id: user.id,
      authId: user.authId,
      type: user.type,
      email: user.email, 
      phoneNumber: user.phoneNumber,
      firstName: user.firstName,
      lastName: user.lastName,
      displayName: user.displayName,
      profilePictureURL: user.profilePictureURL,
      isActive: user.isActive
    };
  }

  async getUserByEmail(email: string): Promise<UserDTO> {
    let user;
    let firebaseUser: firebaseAdmin.auth.UserRecord;

    try {
      firebaseUser = await firebaseAdmin.auth().getUserByEmail(email);
      user = await Prisma.user.findUnique({
        where: { authId: firebaseUser.uid },
      });

      if (!user) { throw new Error(`userId with authID ${firebaseUser.uid} not found.`); }
    } catch (error: unknown) {
      Logger.error(`Failed to get user. Reason = ${getErrorMessage(error)}`);
      throw error;
    }

    return {
      id: user.id,
      authId: user.authId,
      type: user.type,
      email: user.email, 
      phoneNumber: user.phoneNumber,
      firstName: user.firstName,
      lastName: user.lastName,
      displayName: user.displayName,
      profilePictureURL: user.profilePictureURL,
      isActive: user.isActive
    };
  }

  async getUserRoleByAuthId(authId: string): Promise<Role> { // ?!?!?!?!?!????????????????????????????????????????????????
    try {
      const user = await Prisma.user.findUnique({
        where: { authId: authId },
      });
      if (!user) { throw new Error(`userId with authId ${authId} not found.`); }
      return user.type;
    } catch (error: unknown) {
      Logger.error(
        `Failed to get user role. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async getUserIdByAuthId(authId: string): Promise<number> {
    let user;
    try {
      user = await Prisma.user.findUnique({
        where: { authId: authId }
      });

      if (!user) { throw new Error(`userId ${authId} not found.`); }
      return user.id;
    } catch (error: unknown) {
      Logger.error(`Failed to get user. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }
  

  async getAuthIdById(userId: number): Promise<string> {
    try {
      const user = await Prisma.user.findUnique({
        where: { id: userId }
      });
      if (!user) { throw new Error(`userId ${userId} not found.`); }
      
      return user.authId;
    } catch (error: unknown) {
      Logger.error(`Failed to get authId. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async getUsers(): Promise<Array<UserDTO>> {
    let userDtos: Array<UserDTO> = [];
    try {
      const users: Array<UserDTO> = await Prisma.user.findMany();

      userDtos = await Promise.all(
        users.map(async (user) => {
          let firebaseUser: firebaseAdmin.auth.UserRecord;

          try {
            firebaseUser = await firebaseAdmin.auth().getUser(user.auth_id);
          } catch (error) {
            Logger.error(
              `user with authId ${user.auth_id} could not be fetched from Firebase`,
            );
            throw error;
          }

          return {
            id: String(user.id),
            firstName: user.first_name,
            lastName: user.last_name,
            email: firebaseUser.email ?? "",
            role: user.role,
          };
        }),
      );
    } catch (error: unknown) {
      Logger.error(`Failed to get users. Reason = ${getErrorMessage(error)}`);
      throw error;
    }

    return userDtos;
  }

  async updateUserById(userId: number, user: UpdateUserDTO): Promise<UserDTO> {
    let updatedFirebaseUser: firebaseAdmin.auth.UserRecord;

    try {
      const updateResult = await Prisma.user.update(
        {
          where: {id: userId},
          data: user
        }
      );

      // check number of rows affected
      if (updateResult[0] < 1) {
        throw new Error(`userId ${userId} not found.`);
      }

      // the cast to "any" is needed due to a missing property in the Sequelize type definitions
      // https://github.com/sequelize/sequelize/issues/9978#issuecomment-426342219
      /* eslint-disable-next-line no-underscore-dangle, @typescript-eslint/no-explicit-any */
      const oldUser: User = (updateResult[1][0] as any)._previousDataValues;

      try {
        updatedFirebaseUser = await firebaseAdmin
          .auth()
          .updateUser(oldUser.auth_id, { email: user.email });
      } catch (error) {
        // rollback Postgres user updates
        try {
          await User.update(
            {
              first_name: oldUser.first_name,
              last_name: oldUser.last_name,
              role: oldUser.role,
            },
            {
              where: { id: userId },
            },
          );
        } catch (postgresError: unknown) {
          const errorMessage = [
            "Failed to rollback Postgres user update after Firebase user update failure. Reason =",
            getErrorMessage(postgresError),
            "Postgres user id with possibly inconsistent data =",
            oldUser.id,
          ];
          Logger.error(errorMessage.join(" "));
        }

        throw error;
      }
    } catch (error: unknown) {
      Logger.error(`Failed to update user. Reason = ${getErrorMessage(error)}`);
      throw error;
    }

    return {
      id: userId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: updatedFirebaseUser.email ?? "",
      role: user.role,
    };
  }

  async deleteUserById(userId: string): Promise<void> {
    try {
      // Sequelize doesn't provide a way to atomically find, delete, and return deleted row
      const deletedUser: User | null = await User.findByPk(Number(userId));

      if (!deletedUser) {
        throw new Error(`userid ${userId} not found.`);
      }

      const numDestroyed: number = await User.destroy({
        where: { id: userId },
      });

      if (numDestroyed <= 0) {
        throw new Error(`userid ${userId} was not deleted in Postgres.`);
      }

      try {
        await firebaseAdmin.auth().deleteUser(deletedUser.auth_id);
      } catch (error) {
        // rollback user deletion in Postgres
        try {
          await User.create({
            first_name: deletedUser.first_name,
            last_name: deletedUser.last_name,
            auth_id: deletedUser.auth_id,
            role: deletedUser.role,
          });
        } catch (postgresError: unknown) {
          const errorMessage = [
            "Failed to rollback Postgres user deletion after Firebase user deletion failure. Reason =",
            getErrorMessage(postgresError),
            "Firebase uid with non-existent Postgres record =",
            deletedUser.auth_id,
          ];
          Logger.error(errorMessage.join(" "));
        }

        throw error;
      }
    } catch (error: unknown) {
      Logger.error(`Failed to delete user. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async deleteUserByEmail(email: string): Promise<void> {
    try {
      const firebaseUser: firebaseAdmin.auth.UserRecord = await firebaseAdmin
        .auth()
        .getUserByEmail(email);
      const deletedUser: User | null = await User.findOne({
        where: { auth_id: firebaseUser.uid },
      });

      if (!deletedUser) {
        throw new Error(`userid ${firebaseUser.uid} not found.`);
      }

      const numDestroyed: number = await User.destroy({
        where: { auth_id: firebaseUser.uid },
      });

      if (numDestroyed <= 0) {
        throw new Error(
          `userid ${firebaseUser.uid} was not deleted in Postgres.`,
        );
      }

      try {
        await firebaseAdmin.auth().deleteUser(deletedUser.auth_id);
      } catch (error) {
        // rollback user deletion in Postgres
        try {
          await User.create({
            first_name: deletedUser.first_name,
            last_name: deletedUser.last_name,
            auth_id: deletedUser.auth_id,
            role: deletedUser.role,
          });
        } catch (postgresError: unknown) {
          const errorMessage = [
            "Failed to rollback Postgres user deletion after Firebase user deletion failure. Reason =",
            getErrorMessage(postgresError),
            "Firebase uid with non-existent Postgres record =",
            deletedUser.auth_id,
          ];
          Logger.error(errorMessage.join(" "));
        }

        throw error;
      }
    } catch (error: unknown) {
      Logger.error(`Failed to delete user. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }
}

export default UserService;
