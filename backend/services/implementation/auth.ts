import { AuthenticationError } from "apollo-server-express";
import { IAuthService } from "../interface/auth";
// import jwt from "jsonwebtoken";
// import * as jwt from "jsonwebtoken";
const jwt = require("jsonwebtoken");
// const bcrypt = require("bcrypt");
// const CryptoJS = require("crypto-js");
// import bcrypt from "bcrypt";
// import CryptoJS from "crypto-js";

class AuthService implements IAuthService {
  async login(
    role: string,
    encryptedPassword: string,
  ): Promise<{ type: string; accessToken: string }> {
    const storedPasswordHash = "abc123";

    // Decrypt the password
    // const bytes = CryptoJS.AES.decrypt(encryptedPassword, 'secret-key');
    // const password = bytes.toString(CryptoJS.enc.Utf8);

    // if (role === "admin_staff") {
    //   storedPasswordHash = process.env.ADMIN_STAFF_PASSWORD_HASH;
    // } else if (role === "release_staff") {
    //   storedPasswordHash = process.env.RELEASE_STAFF_PASSWORD_HASH;
    // } else {
    //   throw new AuthenticationError("Invalid role");
    // }

    // const isPasswordValid = await bcrypt.compare(
    //   encryptedPassword,
    //   storedPasswordHash,
    // );

    const isPasswordValid = encryptedPassword === storedPasswordHash;

    if (!isPasswordValid) {
      throw new AuthenticationError("Invalid password");
    }

    const jwtSecretKey = process.env.JWT_SECRET;

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
