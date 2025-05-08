import { Participant } from "@prisma/client";
import prisma from "../../prisma";
import ILoginService from "../interface/loginInterface";
const jwt = require("jsonwebtoken");

class LoginService implements ILoginService {
  async adminLogin(
    role: string,
    password: string,
  ): Promise<{ token: string }> {
    var storedPasswordHash = "";

    if (role === "admin") {
      storedPasswordHash = process.env.ADMIN_STAFF_PASSWORD ?? "";
    } else if (role === "relief") {
      storedPasswordHash = process.env.RELIEF_STAFF_PASSWORD ?? "";
    } else {
      throw new Error('Role provided does not exist');
    }

    const isPasswordValid: boolean = password === storedPasswordHash;

    if (!isPasswordValid) {
      throw new Error('Password is incorrect');
    }

    const jwtSecretKey = process.env.JWT_SECRET ?? "";

    if (!jwtSecretKey) {
      throw new Error('Something went wrong');
    }

    const token = jwt.sign(
      { role },
      jwtSecretKey,
      {
        expiresIn: "12h",
      },
    );

    return { token };
  }

  async participantLogin(
    id: number,
    password: string,
  ): Promise<{ token: string }> {
    var participant: Participant | null = null;
    try {
      participant = await prisma.participant.findUnique({
        where: {
          participant_id: id,
          account_removal_date: null
        },
      });
    } catch (err) {
      throw new Error('Something went wrong');
    }

    if (!participant) {
      throw new Error('ID # does not exist');
    }

    const isPasswordValid = password === participant.password;

    if (!isPasswordValid) {
      throw new Error('Password is incorrect');
    }

    const jwtSecretKey = process.env.JWT_SECRET ?? "";

    if (!jwtSecretKey) {
      console.error("JWT secret key not setup");
      throw new Error('Something went wrong');
    }

    const token = jwt.sign(
      {
        role: "participant",
        id
      },
      jwtSecretKey,
      {
        expiresIn: "12h",
      },
    );

      return { token };
  }
}

export default LoginService;
