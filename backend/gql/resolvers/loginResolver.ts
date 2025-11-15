import jwt from "jsonwebtoken";
import { Participant } from "@prisma/client";
import * as ROLES from "../../constants/roles";
import { LOGIN } from "../../constants/systemBadges";
import db from "../../prisma";
import { getToday } from "../../utils/dateUtils";
import { updateBadgeLevelProgress } from "../../utils/badgeUtils";

type LoginResponse = {
  token: string;
};

const loginResolver = {
  Mutation: {
    adminLogin: async (
      _parent: undefined,
      {
        role,
        password,
      }: {
        role: string;
        password: string;
      }
    ): Promise<LoginResponse> => {
      if (role !== ROLES.ADMIN && role !== ROLES.RELIEF)
        throw new Error("invalid role");

      let expectedPassword: string = process.env.ADMIN_STAFF_PASSWORD ?? "";
      if (role === ROLES.RELIEF) {
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
      {
        pid,
        password,
      }: {
        pid: number;
        password: string;
      }
    ): Promise<LoginResponse> => {
      const today = getToday();
      const participant: Participant | null = await db.participant.findUnique({
        where: {
          pid,
          OR: [{ departure: null }, { departure: { gt: today } }],
        },
      });

      if (!participant) throw new Error("participant not found");

      const validPassword: boolean = password === participant.password;
      if (!validPassword) throw new Error("incorrect password");

      const jwtSecretKey = process.env.JWT_SECRET ?? "";
      if (!jwtSecretKey) throw new Error("jwt key missing");

      // TODO: 
      // get lastest login date for the participant
      // only update badge level progress (the next line) if not already logged in today
      await updateBadgeLevelProgress(LOGIN, pid, 1);

      await db.loginHistory.create({ data: { pid } });

      const token = jwt.sign({ role: ROLES.PARTICIPANT, pid }, jwtSecretKey, {
        expiresIn: "12h",
      });
      return { token };
    },
  },
};

export default loginResolver;
