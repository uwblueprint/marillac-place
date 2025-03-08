import { AuthenticationError } from "apollo-server-express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { IAuthService } from "../interface/authInterface";
import CryptoJS from "crypto-js";


class AuthService implements IAuthService {
  async login(role: string, encryptedPassword: string): Promise<{ type: string; accessToken: string }> {
    let storedPasswordHash;

    // Decrypt the password
    const bytes = CryptoJS.AES.decrypt(encryptedPassword, 'your-secret-key');
    const password = bytes.toString(CryptoJS.enc.Utf8);


    if (role === "admin_staff") {
      storedPasswordHash = process.env.ADMIN_STAFF_PASSWORD_HASH;
    } else if (role === "release_staff") {
      storedPasswordHash = process.env.RELEASE_STAFF_PASSWORD_HASH;
    } else {
      throw new AuthenticationError("Invalid role");
    }

    const isPasswordValid = await bcrypt.compare(password, storedPasswordHash);
    if (!isPasswordValid) {
      throw new AuthenticationError("Invalid password");
    }

    const token = jwt.sign({ role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return {
      type: role,
      accessToken: token,
    };
  }
}

export default AuthService;