"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthorizedByEmail = exports.isAuthorizedByUserId = exports.isAuthorizedByRole = exports.getAccessToken = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const authService_1 = __importDefault(require("../services/implementations/authService"));
const userService_1 = __importDefault(require("../services/implementations/userService"));
const authService = new authService_1.default(new userService_1.default());
const getAccessToken = (req) => {
    const authHeaderParts = req.headers.authorization?.split(" ");
    if (authHeaderParts &&
        authHeaderParts.length >= 2 &&
        authHeaderParts[0].toLowerCase() === "bearer") {
        return authHeaderParts[1];
    }
    return null;
};
exports.getAccessToken = getAccessToken;
/* Determine if request is authorized based on accessToken validity and role of client */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const isAuthorizedByRole = (roles) => {
    return async (resolve, parent, args, context, info) => {
        const accessToken = exports.getAccessToken(context.req);
        const authorized = accessToken && (await authService.isAuthorizedByRole(accessToken, roles));
        if (!authorized) {
            throw new apollo_server_express_1.AuthenticationError("Failed authentication and/or authorization by role");
        }
        return resolve(parent, args, context, info);
    };
};
exports.isAuthorizedByRole = isAuthorizedByRole;
/* Determine if request for a user-specific resource is authorized based on accessToken
 * validity and if the userId that the token was issued to matches the requested userId
 * Note: userIdField is the name of the request parameter containing the requested userId */
const isAuthorizedByUserId = (userIdField) => {
    return async (resolve, parent, args, context, info) => {
        const accessToken = exports.getAccessToken(context.req);
        const authorized = accessToken &&
            (await authService.isAuthorizedByUserId(accessToken, args[userIdField]));
        if (!authorized) {
            throw new apollo_server_express_1.AuthenticationError("Failed authentication and/or authorization by userId");
        }
        return resolve(parent, args, context, info);
    };
};
exports.isAuthorizedByUserId = isAuthorizedByUserId;
/* Determine if request for a user-specific resource is authorized based on accessToken
 * validity and if the email that the token was issued to matches the requested email
 * Note: emailField is the name of the request parameter containing the requested email */
const isAuthorizedByEmail = (emailField) => {
    return async (resolve, parent, args, context, info) => {
        const accessToken = exports.getAccessToken(context.req);
        const authorized = accessToken &&
            (await authService.isAuthorizedByEmail(accessToken, args[emailField]));
        if (!authorized) {
            throw new apollo_server_express_1.AuthenticationError("Failed authentication and/or authorization by email");
        }
        return resolve(parent, args, context, info);
    };
};
exports.isAuthorizedByEmail = isAuthorizedByEmail;
