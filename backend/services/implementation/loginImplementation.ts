/* eslint-disable */
import { Participant } from "@prisma/client";
import prisma from "../../prisma";
import ILoginService from "../interface/loginInterface";
import BadgeService from "./badgeImplementation";
import IBadgeService from "../interface/badgeInterface";

const jwt = require("jsonwebtoken");

const badgeService: IBadgeService = new BadgeService();

class LoginService implements ILoginService {
  private async calculateLoginStreak(
      participant_id: number,
  ): Promise<number> {
    const mostRecentLogin = await prisma.login.findFirst({
      where: { participant_id },
      orderBy: { login_date: 'desc' },
      select: { login_date: true },
    });
    const now = new Date();
    let daysLoggedIn = 1;
    if (mostRecentLogin?.login_date) {
      const lastLoginDate = new Date(mostRecentLogin.login_date);
      const diffMs = now.getTime() - lastLoginDate.getTime();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);
      if (diffDays >= 1 && diffDays < 2) {
        const updated = await prisma.participantProgress.update({
          where: { participant_id },
          data: {
            days_logged_in: { increment: 1 },
          },
        });
        daysLoggedIn = updated.days_logged_in;
      } else {
        await prisma.participantProgress.update({
          where: { participant_id },
          data: { days_logged_in: 1 },
        });
      }
    } else {
      await prisma.participantProgress.update({
        where: { participant_id },
        data: { days_logged_in: 1 },
      });
    }
    return daysLoggedIn;
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
      const days = await this.calculateLoginStreak(participant.participant_id);
      await badgeService.evaluateBadge(days, id, 'login');
      await prisma.login.create({
        data: {
          participant_id: id,
          login_date: new Date().toISOString(),
        },
      });
    } catch (err) {
      console.error("Failed to record login:", err);
    }

    return { token };
  }
}

export default LoginService;
