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
const firebaseRestClient_1 = __importDefault(require("../../utilities/firebaseRestClient"));
const logger_1 = __importDefault(require("../../utilities/logger"));
const Logger = logger_1.default(__filename);
class AuthService {
    constructor(userService, emailService = null) {
        this.userService = userService;
        this.emailService = emailService;
    }
    /* eslint-disable class-methods-use-this */
    async generateToken(email, password) {
        try {
            const token = await firebaseRestClient_1.default.signInWithPassword(email, password);
            const user = await this.userService.getUserByEmail(email);
            return { ...token, ...user };
        }
        catch (error) {
            Logger.error(`Failed to generate token for user with email ${email}`);
            throw error;
        }
    }
    /* eslint-disable class-methods-use-this */
    async generateTokenOAuth(idToken) {
        try {
            const googleUser = await firebaseRestClient_1.default.signInWithGoogleOAuth(idToken);
            // googleUser.idToken refers to the Firebase Auth access token for the user
            const token = {
                accessToken: googleUser.idToken,
                refreshToken: googleUser.refreshToken,
            };
            // If user already has a login with this email, just return the token
            try {
                // Note: an error message will be logged from UserService if this lookup fails.
                // You may want to silence the logger for this special OAuth user lookup case
                const user = await this.userService.getUserByEmail(googleUser.email);
                return { ...token, ...user };
                /* eslint-disable-next-line no-empty */
            }
            catch (error) { }
            const user = await this.userService.createUser({
                firstName: googleUser.firstName,
                lastName: googleUser.lastName,
                email: googleUser.email,
                role: "User",
                password: "",
            }, googleUser.localId, "GOOGLE");
            return { ...token, ...user };
        }
        catch (error) {
            Logger.error(`Failed to generate token for user with OAuth ID token`);
            throw error;
        }
    }
    async revokeTokens(userId) {
        try {
            const authId = await this.userService.getAuthIdById(userId);
            await firebaseAdmin.auth().revokeRefreshTokens(authId);
        }
        catch (error) {
            const errorMessage = [
                "Failed to revoke refresh tokens of user with id",
                `${userId}.`,
                "Reason =",
                errorUtils_1.getErrorMessage(error),
            ];
            Logger.error(errorMessage.join(" "));
            throw error;
        }
    }
    async renewToken(refreshToken) {
        try {
            return await firebaseRestClient_1.default.refreshToken(refreshToken);
        }
        catch (error) {
            Logger.error("Failed to refresh token");
            throw error;
        }
    }
    async resetPassword(email) {
        if (!this.emailService) {
            const errorMessage = "Attempted to call resetPassword but this instance of AuthService does not have an EmailService instance";
            Logger.error(errorMessage);
            throw new Error(errorMessage);
        }
        try {
            const resetLink = await firebaseAdmin
                .auth()
                .generatePasswordResetLink(email);
            const emailBody = `
      Hello,
      <br><br>
      We have received a password reset request for your account.
      Please click the following link to reset it.
      <strong>This link is only valid for 1 hour.</strong>
      <br><br>
      <a href=${resetLink}>Reset Password</a>`;
            this.emailService.sendEmail(email, "Your Password Reset Link", emailBody);
        }
        catch (error) {
            Logger.error(`Failed to generate password reset link for user with email ${email}`);
            throw error;
        }
    }
    async sendEmailVerificationLink(email) {
        if (!this.emailService) {
            const errorMessage = "Attempted to call sendEmailVerificationLink but this instance of AuthService does not have an EmailService instance";
            Logger.error(errorMessage);
            throw new Error(errorMessage);
        }
        try {
            const emailVerificationLink = await firebaseAdmin
                .auth()
                .generateEmailVerificationLink(email);
            const emailBody = `
      Hello,
      <br><br>
      Please click the following link to verify your email and activate your account.
      <strong>This link is only valid for 1 hour.</strong>
      <br><br>
      <a href=${emailVerificationLink}>Verify email</a>`;
            this.emailService.sendEmail(email, "Verify your email", emailBody);
        }
        catch (error) {
            Logger.error(`Failed to generate email verification link for user with email ${email}`);
            throw error;
        }
    }
    async isAuthorizedByRole(accessToken, roles) {
        try {
            const decodedIdToken = await firebaseAdmin
                .auth()
                .verifyIdToken(accessToken, true);
            const userRole = await this.userService.getUserRoleByAuthId(decodedIdToken.uid);
            const firebaseUser = await firebaseAdmin
                .auth()
                .getUser(decodedIdToken.uid);
            return firebaseUser.emailVerified && roles.has(userRole);
        }
        catch (error) {
            return false;
        }
    }
    async isAuthorizedByUserId(accessToken, requestedUserId) {
        try {
            const decodedIdToken = await firebaseAdmin
                .auth()
                .verifyIdToken(accessToken, true);
            const tokenUserId = await this.userService.getUserIdByAuthId(decodedIdToken.uid);
            const firebaseUser = await firebaseAdmin
                .auth()
                .getUser(decodedIdToken.uid);
            return (firebaseUser.emailVerified && String(tokenUserId) === requestedUserId);
        }
        catch (error) {
            return false;
        }
    }
    async isAuthorizedByEmail(accessToken, requestedEmail) {
        try {
            const decodedIdToken = await firebaseAdmin
                .auth()
                .verifyIdToken(accessToken, true);
            const firebaseUser = await firebaseAdmin
                .auth()
                .getUser(decodedIdToken.uid);
            return (firebaseUser.emailVerified && decodedIdToken.email === requestedEmail);
        }
        catch (error) {
            return false;
        }
    }
}
exports.default = AuthService;
