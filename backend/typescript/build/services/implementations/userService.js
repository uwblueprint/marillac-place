"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebaseAdmin = __importStar(require("firebase-admin"));
const errorUtils_1 = require("../../utilities/errorUtils");
const logger_1 = __importDefault(require("../../utilities/logger"));
const user_model_1 = __importDefault(require("../../models/user.model"));
const Logger = logger_1.default(__filename);
class UserService {
    /* eslint-disable class-methods-use-this */
    async getUserById(userId) {
        let user;
        let firebaseUser;
        try {
            user = await user_model_1.default.findByPk(Number(userId));
            if (!user) {
                throw new Error(`userId ${userId} not found.`);
            }
            firebaseUser = await firebaseAdmin.auth().getUser(user.auth_id);
        }
        catch (error) {
            Logger.error(`Failed to get user. Reason = ${errorUtils_1.getErrorMessage(error)}`);
            throw error;
        }
        return {
            id: String(user.id),
            firstName: user.first_name,
            lastName: user.last_name,
            email: firebaseUser.email ?? "",
            role: user.role,
        };
    }
    async getUserByEmail(email) {
        let user;
        let firebaseUser;
        try {
            firebaseUser = await firebaseAdmin.auth().getUserByEmail(email);
            user = await user_model_1.default.findOne({
                where: { auth_id: firebaseUser.uid },
            });
            if (!user) {
                throw new Error(`userId with authID ${firebaseUser.uid} not found.`);
            }
        }
        catch (error) {
            Logger.error(`Failed to get user. Reason = ${errorUtils_1.getErrorMessage(error)}`);
            throw error;
        }
        return {
            id: String(user.id),
            firstName: user.first_name,
            lastName: user.last_name,
            email: firebaseUser.email ?? "",
            role: user.role,
        };
    }
    async getUserRoleByAuthId(authId) {
        try {
            const user = await user_model_1.default.findOne({
                where: { auth_id: authId },
            });
            if (!user) {
                throw new Error(`userId with authId ${authId} not found.`);
            }
            return user.role;
        }
        catch (error) {
            Logger.error(`Failed to get user role. Reason = ${errorUtils_1.getErrorMessage(error)}`);
            throw error;
        }
    }
    async getUserIdByAuthId(authId) {
        try {
            const user = await user_model_1.default.findOne({
                where: { auth_id: authId },
            });
            if (!user) {
                throw new Error(`user with authId ${authId} not found.`);
            }
            return String(user.id);
        }
        catch (error) {
            Logger.error(`Failed to get user id. Reason = ${errorUtils_1.getErrorMessage(error)}`);
            throw error;
        }
    }
    async getAuthIdById(userId) {
        try {
            const user = await user_model_1.default.findByPk(Number(userId));
            if (!user) {
                throw new Error(`userId ${userId} not found.`);
            }
            return user.auth_id;
        }
        catch (error) {
            Logger.error(`Failed to get authId. Reason = ${errorUtils_1.getErrorMessage(error)}`);
            throw error;
        }
    }
    async getUsers() {
        let userDtos = [];
        try {
            const users = await user_model_1.default.findAll();
            userDtos = await Promise.all(users.map(async (user) => {
                let firebaseUser;
                try {
                    firebaseUser = await firebaseAdmin.auth().getUser(user.auth_id);
                }
                catch (error) {
                    Logger.error(`user with authId ${user.auth_id} could not be fetched from Firebase`);
                    throw error;
                }
                return {
                    id: String(user.id),
                    firstName: user.first_name,
                    lastName: user.last_name,
                    email: firebaseUser.email ?? "",
                    role: user.role,
                };
            }));
        }
        catch (error) {
            Logger.error(`Failed to get users. Reason = ${errorUtils_1.getErrorMessage(error)}`);
            throw error;
        }
        return userDtos;
    }
    async createUser(user, authId, signUpMethod = "PASSWORD") {
        let newUser;
        let firebaseUser;
        try {
            if (signUpMethod === "GOOGLE") {
                /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
                firebaseUser = await firebaseAdmin.auth().getUser(authId);
            }
            else {
                // signUpMethod === PASSWORD
                firebaseUser = await firebaseAdmin.auth().createUser({
                    email: user.email,
                    password: user.password,
                });
            }
            try {
                newUser = await user_model_1.default.create({
                    first_name: user.firstName,
                    last_name: user.lastName,
                    auth_id: firebaseUser.uid,
                    role: user.role,
                });
            }
            catch (postgresError) {
                try {
                    await firebaseAdmin.auth().deleteUser(firebaseUser.uid);
                }
                catch (firebaseError) {
                    const errorMessage = [
                        "Failed to rollback Firebase user creation after Postgres user creation failure. Reason =",
                        errorUtils_1.getErrorMessage(firebaseError),
                        "Orphaned authId (Firebase uid) =",
                        firebaseUser.uid,
                    ];
                    Logger.error(errorMessage.join(" "));
                }
                throw postgresError;
            }
        }
        catch (error) {
            Logger.error(`Failed to create user. Reason = ${errorUtils_1.getErrorMessage(error)}`);
            throw error;
        }
        return {
            id: String(newUser.id),
            firstName: newUser.first_name,
            lastName: newUser.last_name,
            email: firebaseUser.email ?? "",
            role: newUser.role,
        };
    }
    async updateUserById(userId, user) {
        let updatedFirebaseUser;
        try {
            const updateResult = await user_model_1.default.update({
                first_name: user.firstName,
                last_name: user.lastName,
                role: user.role,
            }, {
                where: { id: userId },
                returning: true,
            });
            // check number of rows affected
            if (updateResult[0] < 1) {
                throw new Error(`userId ${userId} not found.`);
            }
            // the cast to "any" is needed due to a missing property in the Sequelize type definitions
            // https://github.com/sequelize/sequelize/issues/9978#issuecomment-426342219
            /* eslint-disable-next-line no-underscore-dangle, @typescript-eslint/no-explicit-any */
            const oldUser = updateResult[1][0]._previousDataValues;
            try {
                updatedFirebaseUser = await firebaseAdmin
                    .auth()
                    .updateUser(oldUser.auth_id, { email: user.email });
            }
            catch (error) {
                // rollback Postgres user updates
                try {
                    await user_model_1.default.update({
                        first_name: oldUser.first_name,
                        last_name: oldUser.last_name,
                        role: oldUser.role,
                    }, {
                        where: { id: userId },
                    });
                }
                catch (postgresError) {
                    const errorMessage = [
                        "Failed to rollback Postgres user update after Firebase user update failure. Reason =",
                        errorUtils_1.getErrorMessage(postgresError),
                        "Postgres user id with possibly inconsistent data =",
                        oldUser.id,
                    ];
                    Logger.error(errorMessage.join(" "));
                }
                throw error;
            }
        }
        catch (error) {
            Logger.error(`Failed to update user. Reason = ${errorUtils_1.getErrorMessage(error)}`);
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
    async deleteUserById(userId) {
        try {
            // Sequelize doesn't provide a way to atomically find, delete, and return deleted row
            const deletedUser = await user_model_1.default.findByPk(Number(userId));
            if (!deletedUser) {
                throw new Error(`userid ${userId} not found.`);
            }
            const numDestroyed = await user_model_1.default.destroy({
                where: { id: userId },
            });
            if (numDestroyed <= 0) {
                throw new Error(`userid ${userId} was not deleted in Postgres.`);
            }
            try {
                await firebaseAdmin.auth().deleteUser(deletedUser.auth_id);
            }
            catch (error) {
                // rollback user deletion in Postgres
                try {
                    await user_model_1.default.create({
                        first_name: deletedUser.first_name,
                        last_name: deletedUser.last_name,
                        auth_id: deletedUser.auth_id,
                        role: deletedUser.role,
                    });
                }
                catch (postgresError) {
                    const errorMessage = [
                        "Failed to rollback Postgres user deletion after Firebase user deletion failure. Reason =",
                        errorUtils_1.getErrorMessage(postgresError),
                        "Firebase uid with non-existent Postgres record =",
                        deletedUser.auth_id,
                    ];
                    Logger.error(errorMessage.join(" "));
                }
                throw error;
            }
        }
        catch (error) {
            Logger.error(`Failed to delete user. Reason = ${errorUtils_1.getErrorMessage(error)}`);
            throw error;
        }
    }
    async deleteUserByEmail(email) {
        try {
            const firebaseUser = await firebaseAdmin
                .auth()
                .getUserByEmail(email);
            const deletedUser = await user_model_1.default.findOne({
                where: { auth_id: firebaseUser.uid },
            });
            if (!deletedUser) {
                throw new Error(`userid ${firebaseUser.uid} not found.`);
            }
            const numDestroyed = await user_model_1.default.destroy({
                where: { auth_id: firebaseUser.uid },
            });
            if (numDestroyed <= 0) {
                throw new Error(`userid ${firebaseUser.uid} was not deleted in Postgres.`);
            }
            try {
                await firebaseAdmin.auth().deleteUser(deletedUser.auth_id);
            }
            catch (error) {
                // rollback user deletion in Postgres
                try {
                    await user_model_1.default.create({
                        first_name: deletedUser.first_name,
                        last_name: deletedUser.last_name,
                        auth_id: deletedUser.auth_id,
                        role: deletedUser.role,
                    });
                }
                catch (postgresError) {
                    const errorMessage = [
                        "Failed to rollback Postgres user deletion after Firebase user deletion failure. Reason =",
                        errorUtils_1.getErrorMessage(postgresError),
                        "Firebase uid with non-existent Postgres record =",
                        deletedUser.auth_id,
                    ];
                    Logger.error(errorMessage.join(" "));
                }
                throw error;
            }
        }
        catch (error) {
            Logger.error(`Failed to delete user. Reason = ${errorUtils_1.getErrorMessage(error)}`);
            throw error;
        }
    }
}
exports.default = UserService;
