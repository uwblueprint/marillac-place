import { CookieOptions, Request, Response } from "express";

import { UserType } from "../../prisma";
import nodemailerConfig from "../../nodemailer.config";
import AuthService from "../../services/implementations/authService";
import EmailService from "../../services/implementations/emailService";
import UserService from "../../services/implementations/userService";
import IAuthService, { AuthDTO } from "../../services/interfaces/authService";
import IEmailService from "../../services/interfaces/emailService";
import IUserService from "../../services/interfaces/userService";

const userService: IUserService = new UserService();
const emailService: IEmailService = new EmailService(nodemailerConfig);
const authService: IAuthService = new AuthService(userService, emailService);

const cookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: process.env.PREVIEW_DEPLOY ? "none" : "strict",
  secure: process.env.NODE_ENV === "production",
};

const authResolvers = {
  Mutation: {
    login: async (
      _parent: undefined,
      {
        email,
        password,
        userType,
      }: { email: string; password: string; userType: UserType },
      { res }: { res: Response },
    ): Promise<Omit<AuthDTO, "refreshToken">> => {
      const authDTO = await authService.generateToken(
        email,
        password,
        userType,
      );
      const { refreshToken, ...user } = authDTO;
      res.cookie("refreshToken", refreshToken, cookieOptions);
      return user;
    },
    refresh: async (
      _parent: undefined,
      _args: Record<string, undefined>,
      { req, res }: { req: Request; res: Response },
    ): Promise<string> => {
      // req.cookies.refreshToken is undefined
      const token = await authService.renewToken(req.cookies.refreshToken);
      res.cookie("refreshToken", token.refreshToken, cookieOptions);
      return token.accessToken;
    },
    logout: async (
      _parent: undefined,
      { userId }: { userId: string },
    ): Promise<void> => {
      await authService.revokeTokens(userId);
    },
    resetPassword: async (
      _parent: undefined,
      { email }: { email: string },
    ): Promise<boolean> => {
      await authService.resetPassword(email);
      return true;
    },
  },
};

export default authResolvers;
