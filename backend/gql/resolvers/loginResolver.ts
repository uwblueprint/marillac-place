import { Participant } from "@prisma/client";
import * as ROLES from "../../constants/roles";
import { LOGIN } from "../../constants/systemBadges";
import db from "../../prisma";
import { updateBadgeLevelProgress } from "../../utils/badgeUtils";
import { getEndOfDay, getStartOfDay } from "../../utils/dateUtils";
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

function findCurrentParticipant(pid: number): Promise<Participant | null> {
  return db.participant.findUnique({
    where: {
      pid,
      OR: [{ departure: null }, { departure: { gt: getEndOfDay(new Date()) } }],
    },
  });
}

// Records the first login (or session refresh) of each day. Sessions now last
// across days, so refreshes must count too, or the login streak badge and
// login stats in reports would stop advancing.
async function recordDailyLogin(pid: number): Promise<void> {
  const loggedInToday = await db.loginHistory.findFirst({
    where: {
      pid,
      date: {
        gte: getStartOfDay(new Date()),
        lte: getEndOfDay(new Date()),
      },
    },
  });
  if (loggedInToday) return;

  await updateBadgeLevelProgress(LOGIN, pid, 1);
  await db.loginHistory.create({ data: { pid } });
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
        if (!participant) throw new Error("participant not found");
        await recordDailyLogin(claims.pid);
      }

      return { token: signSessionToken(claims) };
    },
  },
};

export default loginResolver;
