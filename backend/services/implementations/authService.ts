import * as firebaseAdmin from "firebase-admin";

import { UserType } from "../../prisma";
import { Token } from "../../types";
import IAuthService, { AuthDTO } from "../interfaces/authService";
import IEmailService from "../interfaces/emailService";
import IUserService from "../interfaces/userService";
import { getErrorMessage } from "../../utilities/errorUtils";
import FirebaseRestClient from "../../utilities/firebaseRestClient";
import logger from "../../utilities/logger";

const Logger = logger(__filename);

class AuthService implements IAuthService {
  userService: IUserService;

  emailService: IEmailService | null;

  constructor(
    userService: IUserService,
    emailService: IEmailService | null = null,
  ) {
    this.userService = userService;
    this.emailService = emailService;
  }

  /* eslint-disable class-methods-use-this */
  async generateToken(
    email: string,
    password: string,
    userType: UserType,
  ): Promise<AuthDTO> {
    try {
      const token = await FirebaseRestClient.signInWithPassword(
        email,
        password,
      );
      const user = await this.userService.getUserByEmail(email);
      if (user.type !== userType) {
        throw new Error("User type does not match");
      }
      return { ...token, ...user };
    } catch (error) {
      Logger.error(`Failed to generate token for user with email ${email}`);
      throw error;
    }
  }

  async revokeTokens(userId: string): Promise<void> {
    try {
      const authId = await this.userService.getAuthIdById(userId);

      await firebaseAdmin.auth().revokeRefreshTokens(authId);
    } catch (error: unknown) {
      const errorMessage = [
        "Failed to revoke refresh tokens of user with id",
        `${userId}.`,
        "Reason =",
        getErrorMessage(error),
      ];
      Logger.error(errorMessage.join(" "));

      throw error;
    }
  }

  async renewToken(refreshToken: string): Promise<Token> {
    try {
      return await FirebaseRestClient.refreshToken(refreshToken);
    } catch (error) {
      Logger.error("Failed to refresh token");
      throw error;
    }
  }

  async resetPassword(email: string): Promise<void> {
    if (!this.emailService) {
      const errorMessage =
        "Attempted to call resetPassword but this instance of AuthService does not have an EmailService instance";
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
    } catch (error) {
      Logger.error(
        `Failed to generate password reset link for user with email ${email}`,
      );
      throw error;
    }
  }

  async sendEmailVerificationLink(email: string): Promise<void> {
    if (!this.emailService) {
      const errorMessage =
        "Attempted to call sendEmailVerificationLink but this instance of AuthService does not have an EmailService instance";
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
    } catch (error) {
      Logger.error(
        `Failed to generate email verification link for user with email ${email}`,
      );
      throw error;
    }
  }

  async isAuthorizedByUserType(
    accessToken: string,
    types: Set<UserType>,
  ): Promise<boolean> {
    try {
      const decodedIdToken: firebaseAdmin.auth.DecodedIdToken = await firebaseAdmin
        .auth()
        .verifyIdToken(accessToken, true);
      const userRole = await this.userService.getUserTypeByAuthId(
        decodedIdToken.uid,
      );

      const firebaseUser = await firebaseAdmin
        .auth()
        .getUser(decodedIdToken.uid);

      return firebaseUser.emailVerified && types.has(userRole);
    } catch (error) {
      return false;
    }
  }

  async isAuthorizedByUserId(
    accessToken: string,
    requestedUserId: string,
  ): Promise<boolean> {
    try {
      const decodedIdToken: firebaseAdmin.auth.DecodedIdToken = await firebaseAdmin
        .auth()
        .verifyIdToken(accessToken, true);
      const tokenUserId = await this.userService.getUserIdByAuthId(
        decodedIdToken.uid,
      );

      const firebaseUser = await firebaseAdmin
        .auth()
        .getUser(decodedIdToken.uid);

      return (
        firebaseUser.emailVerified && String(tokenUserId) === requestedUserId
      );
    } catch (error) {
      return false;
    }
  }

  async isAuthorizedByEmail(
    accessToken: string,
    requestedEmail: string,
  ): Promise<boolean> {
    try {
      const decodedIdToken: firebaseAdmin.auth.DecodedIdToken = await firebaseAdmin
        .auth()
        .verifyIdToken(accessToken, true);

      const firebaseUser = await firebaseAdmin
        .auth()
        .getUser(decodedIdToken.uid);

      return (
        firebaseUser.emailVerified && decodedIdToken.email === requestedEmail
      );
    } catch (error) {
      return false;
    }
  }
}

export default AuthService;
