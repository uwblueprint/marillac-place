/* eslint-disable */
import { Participant } from "@prisma/client";
import prisma from "../../prisma";
import ILoginService from "../interface/loginInterface";
import BadgeService from "./badgeImplementation";
import IBadgeService from "../interface/badgeInterface";

const jwt = require("jsonwebtoken");

const badgeService: IBadgeService = new BadgeService();

class LoginService implements ILoginService {
  private async addLogin(
      participant_id: number,
  ): Promise<boolean> {
    try {
      await prisma.login.create({
        data: {
          participant_id: participant_id,
          login_date:  new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString().replace(".000", "")
        },
      });
      return true;
    } catch(err) {
      return false;
    }
  }


  private async updateLoginStreak(
      participant_id: number,
  ): Promise<number> {
    const mostRecentLogin = await prisma.login.findFirst({
      where: { participant_id },
      orderBy: { login_date: 'desc' },
      select: { login_date: true },
    });
    if (mostRecentLogin?.login_date) {
      const today = new Date(`${new Date().toISOString().split("T")[0]}T00:00:00Z`);
      const lastLoginDate = new Date(mostRecentLogin.login_date);
      if (today.getTime() === lastLoginDate.getTime()) {
        const progress = await prisma.participantProgress.findUnique({where: {participant_id}});
        return progress!.days_logged_in;
      }
    }
    const updated = await prisma.participantProgress.update({
      where: {participant_id},
      data: {
        days_logged_in: {increment: 1},
      },
    });
    await this.addLogin(participant_id);
    return updated!.days_logged_in;
  }

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

    try {
      const days = await this.updateLoginStreak(participant.participant_id);
      await badgeService.evaluateBadge(days, id, 'login');
    } catch (err) {
      console.error("Failed to record login:", err);
    }

    return { token };
  }
}

export default LoginService;
