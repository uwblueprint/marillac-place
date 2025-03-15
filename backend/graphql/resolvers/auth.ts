import { AuthenticationError } from "apollo-server-express";
import { IAuthService } from "../services/interface/authInterface";
import AuthService from "../services/implementation/auth";

const authService: IAuthService = new AuthService();

const authResolver = {
  Mutation: {
    login: async ({
      role,
      encryptedPassword,
    }: {
      role: string;
      encryptedPassword: string;
    }) => {
      try {
        return await authService.login(role, encryptedPassword);
      } catch (error) {
        if (error instanceof Error) {
          throw new AuthenticationError(error.message);
        } else {
          throw new AuthenticationError("An unknown error occurred");
        }
      }
    },
  },
};

export default authResolver;
