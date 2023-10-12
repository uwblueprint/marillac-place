"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_config_1 = __importDefault(require("../../nodemailer.config"));
const authService_1 = __importDefault(require("../../services/implementations/authService"));
const emailService_1 = __importDefault(require("../../services/implementations/emailService"));
const userService_1 = __importDefault(require("../../services/implementations/userService"));
const CSVUtils_1 = require("../../utilities/CSVUtils");
const userService = new userService_1.default();
const emailService = new emailService_1.default(nodemailer_config_1.default);
const authService = new authService_1.default(userService, emailService);
const userResolvers = {
    Query: {
        userById: async (_parent, { id }) => {
            return userService.getUserById(id);
        },
        userByEmail: async (_parent, { email }) => {
            return userService.getUserByEmail(email);
        },
        users: async () => {
            return userService.getUsers();
        },
        usersCSV: async () => {
            const users = await userService.getUsers();
            const csv = await CSVUtils_1.generateCSV({ data: users });
            return csv;
        },
    },
    Mutation: {
        createUser: async (_parent, { user }) => {
            const newUser = await userService.createUser(user);
            await authService.sendEmailVerificationLink(newUser.email);
            return newUser;
        },
        updateUser: async (_parent, { id, user }) => {
            return userService.updateUserById(id, user);
        },
        deleteUserById: async (_parent, { id }) => {
            return userService.deleteUserById(id);
        },
        deleteUserByEmail: async (_parent, { email }) => {
            return userService.deleteUserByEmail(email);
        },
    },
};
exports.default = userResolvers;
