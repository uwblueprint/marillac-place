import * as ROLES from "../../constants/roles";
import { recordDailyLogin } from "../../utils/loginUtils";
import { findCurrentParticipant } from "../../utils/participantUtils";
import { nowInSeconds, signSessionToken } from "../../utils/sessionUtils";

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
  },
};

export default loginResolver;
