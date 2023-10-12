"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_config_1 = __importDefault(require("../../nodemailer.config"));
const authService_1 = __importDefault(require("../../services/implementations/authService"));
const emailService_1 = __importDefault(require("../../services/implementations/emailService"));
const userService_1 = __importDefault(require("../../services/implementations/userService"));
const userService = new userService_1.default();
const emailService = new emailService_1.default(nodemailer_config_1.default);
const authService = new authService_1.default(userService, emailService);
const cookieOptions = {
    httpOnly: true,
    sameSite: process.env.PREVIEW_DEPLOY ? "none" : "strict",
    secure: process.env.NODE_ENV === "production",
};
const authResolvers = {
    Mutation: {
        login: async (_parent, { email, password }, { res }) => {
            const authDTO = await authService.generateToken(email, password);
            const { refreshToken, ...rest } = authDTO;
            res.cookie("refreshToken", refreshToken, cookieOptions);
            return rest;
        },
        loginWithGoogle: async (_parent, { idToken }, { res }) => {
            const authDTO = await authService.generateTokenOAuth(idToken);
            const { refreshToken, ...rest } = authDTO;
            res.cookie("refreshToken", refreshToken, cookieOptions);
            return rest;
        },
        register: async (_parent, { user }, { res }) => {
            await userService.createUser({ ...user, role: "User" });
            const authDTO = await authService.generateToken(user.email, user.password);
            const { refreshToken, ...rest } = authDTO;
            await authService.sendEmailVerificationLink(user.email);
            res.cookie("refreshToken", refreshToken, cookieOptions);
            return rest;
        },
        refresh: async (_parent, _args, { req, res }) => {
            const token = await authService.renewToken(req.cookies.refreshToken);
            res.cookie("refreshToken", token.refreshToken, cookieOptions);
            return token.accessToken;
        },
        logout: async (_parent, { userId }) => {
            await authService.revokeTokens(userId);
        },
        resetPassword: async (_parent, { email }) => {
            await authService.resetPassword(email);
            return true;
        },
    },
};
exports.default = authResolvers;
