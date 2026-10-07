import { Prisma } from "@prisma/client";
import { AuthenticationError } from "apollo-server-express";
import * as ROLES from "../../constants/roles";
import { LOGIN } from "../../constants/systemBadges";
import db from "../../prisma";
import { updateBadgeLevelProgress } from "../../utils/badgeUtils";
import { findCurrentParticipant } from "../../utils/participantUtils";
import { getStartOfDay } from "../../utils/dateUtils";
import {
  getBearerToken,
  nowInSeconds,
  signSessionToken,
  verifySessionToken,
} from "../../utils/sessionUtils";

type LoginResponse = {
  token: string;
};

type AuthContext = { req: { headers: { authorization?: string } } };

// Records the first login (or session refresh) of each day. Sessions now last
// across days, so refreshes must count too, or the login streak badge and
// login stats in reports would stop advancing. Rows are keyed on (pid, start
// of day), so the primary key makes concurrent logins count only once.
async function recordDailyLogin(pid: number): Promise<void> {
  try {
    await db.loginHistory.create({
      data: { pid, date: getStartOfDay(new Date()) },
    });
  } catch (err) {
    const alreadyLoggedInToday =
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002";
    if (alreadyLoggedInToday) return;
    throw err;
  }
  await updateBadgeLevelProgress(LOGIN, pid, 1);
}

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

      const token = signSessionToken({
        role,
        sessionStartedAt: nowInSeconds(),
      });
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
      const participant = await findCurrentParticipant(pid);
      if (!participant) throw new Error("participant not found");

      const validPassword: boolean = password === participant.password;
      if (!validPassword) throw new Error("incorrect password");

      const token = signSessionToken({
        role: ROLES.PARTICIPANT,
        pid,
        sessionStartedAt: nowInSeconds(),
      });
      await recordDailyLogin(pid);
      return { token };
    },
    refreshSession: async (
      _parent: undefined,
      _args: Record<string, never>,
      context: AuthContext
    ): Promise<LoginResponse> => {
      const claims = verifySessionToken(
        getBearerToken(context.req.headers.authorization)
      );

      if (claims.role === ROLES.PARTICIPANT) {
        const participant = await findCurrentParticipant(claims.pid);
        if (!participant)
          throw new AuthenticationError("participant not found");
        await recordDailyLogin(claims.pid);
      }

      return { token: signSessionToken(claims) };
    },
  },
};

export default loginResolver;
