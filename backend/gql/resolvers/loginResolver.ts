import jwt from "jsonwebtoken";
import { Participant } from "@prisma/client";
import * as staffRole from "../../constants/staffRoles";
import { LOGIN } from "../../constants/systemBadges"
import db from "../../prisma";
import { getToday } from "../../utils/dateUtils";
import { updateBadgeLevelProgress } from "../../utils/badgeUtils";

type AdminLoginResponse = {
  token: string;
}

type ParticipantLoginResponse = {
  token: string;
  participant: Participant;
}

const loginResolver = {
  Mutation: {
    adminLogin: async (
      _parent: undefined,
      { role, password }: {
        role: string;
        password: string;
      }
    ): Promise<AdminLoginResponse> => {
      if (!staffRole.STAFF_ROLES.includes(role)) throw new Error("invalid role");

      let expectedPassword: string = process.env.ADMIN_STAFF_PASSWORD ?? "";
      if (role === staffRole.RELIEF) {
        expectedPassword = process.env.RELIEF_STAFF_PASSWORD ?? "";
      }
      if (expectedPassword === "") throw new Error("password unset");

      const validPassword: boolean = password === expectedPassword;
      if (!validPassword) throw new Error("incorrect password");

      const jwtSecretKey = process.env.JWT_SECRET ?? "";
      if (!jwtSecretKey) throw new Error("jwt key missing");

      const token = jwt.sign({ role }, jwtSecretKey, { expiresIn: "12h" });
      return { token };
    },
    participantLogin: async (
      _parent: undefined,
      { pid, password }: {
        pid: number;
        password: string;
      }
    ): Promise<ParticipantLoginResponse> => {
      const today = getToday()
      const participant: Participant | null = await db.participant.findUnique({
        where: {
          pid,
          OR: [
            { departure: null },
            { departure: { gt: today } },
          ],
        },
      });

      if (!participant) throw new Error("participant not found")
      
      const validPassword: boolean = password === participant.password;
      if (!validPassword) throw new Error("incorrect password");

      const jwtSecretKey = process.env.JWT_SECRET ?? "";
      if (!jwtSecretKey) throw new Error("jwt key missing");

      await db.loginHistory.create({ data: { pid } });
      await updateBadgeLevelProgress(LOGIN, pid, 1);

      const token = jwt.sign(
        { role: "participant", pid },
        jwtSecretKey,
        { expiresIn: "12h" }
      );
      return { token, participant };
    },
  },
};

export default loginResolver;
