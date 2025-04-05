import { AuthenticationError } from "apollo-server-express";
import { IAuthService } from "../interface/auth";
// import jwt from "jsonwebtoken";
const jwt = require("jsonwebtoken");

class AuthService implements IAuthService {
  async login(
    role: string,
    encryptedPassword: string,
  ): Promise<{ type: string; accessToken: string }> {
    let storedPasswordHash = "";

    if (role === "admin_staff") {
      storedPasswordHash = process.env.ADMIN_STAFF_PASSWORD_HASH ?? "";
    } else if (role === "release_staff") {
      storedPasswordHash = process.env.RELEASE_STAFF_PASSWORD_HASH ?? "";
    } else {
      throw new AuthenticationError("Invalid role");
    }

    const isPasswordValid = encryptedPassword === storedPasswordHash;

    if (!isPasswordValid) {
      throw new AuthenticationError("Invalid password");
    }

    const jwtSecretKey = process.env.JWT_SECRET ?? "";

    if (!jwtSecretKey) {
      throw new Error("JWT_SECRET is not defined");
    }

    const token = jwt.sign(
      { role, password: storedPasswordHash },
      jwtSecretKey,
      {
        expiresIn: "8h",
      },
    );

    return {
      type: role,
      accessToken: token,
    };
  }
}

export default AuthService;
