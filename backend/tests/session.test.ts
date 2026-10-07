import { after, beforeEach, describe, it } from "node:test";
import assert from "node:assert/strict";
import jwt, { JwtPayload } from "jsonwebtoken";
import * as ROLES from "../constants/roles";
import { LOGIN } from "../constants/systemBadges";
import { SESSION_DURATIONS } from "../constants/session";
import db from "../prisma";
import loginResolver from "../gql/resolvers/loginResolver";
import {
  getBearerToken,
  getSessionExpiry,
  nowInSeconds,
  SessionClaims,
  signSessionToken,
  verifySessionToken,
} from "../utils/sessionUtils";

const JWT_SECRET = "test-jwt-secret";
const STAFF_PASSWORD = "staff-password";
const RELIEF_PASSWORD = "relief-password";
const PARTICIPANT_PASSWORD = "participant-password";
const PID = 7;
const T0 = 1_800_000_000; // fixed "now" for pure tests

process.env.JWT_SECRET = JWT_SECRET;
process.env.ADMIN_STAFF_PASSWORD = STAFF_PASSWORD;
process.env.RELIEF_STAFF_PASSWORD = RELIEF_PASSWORD;

const ALL_ROLES = [ROLES.ADMIN, ROLES.RELIEF, ROLES.PARTICIPANT] as const;

function claimsFor(
  role: (typeof ALL_ROLES)[number],
  sessionStartedAt: number
): SessionClaims {
  return role === ROLES.PARTICIPANT
    ? { role, pid: PID, sessionStartedAt }
    : { role, sessionStartedAt };
}

function decode(token: string): JwtPayload {
  const payload = jwt.decode(token);
  assert(payload && typeof payload !== "string");
  return payload;
}

function bearer(token: string) {
  return { req: { headers: { authorization: `Bearer ${token}` } } };
}

describe("getSessionExpiry", () => {
  ALL_ROLES.forEach((role) => {
    const { idleTimeoutSeconds, maxSessionSeconds } = SESSION_DURATIONS[role];

    it(`${role}: fresh session expires after the idle timeout`, () => {
      assert.equal(getSessionExpiry(role, T0, T0), T0 + idleTimeoutSeconds);
    });

    it(`${role}: expiry is capped at the max session length`, () => {
      const start = T0 - maxSessionSeconds + 60;
      assert.equal(getSessionExpiry(role, start, T0), T0 + 60);
    });

    it(`${role}: idle and max bounds meet exactly`, () => {
      const start = T0 + idleTimeoutSeconds - maxSessionSeconds;
      assert.equal(getSessionExpiry(role, start, T0), T0 + idleTimeoutSeconds);
    });
  });

  it("idle timeout is shorter than max session length for every role", () => {
    ALL_ROLES.forEach((role) => {
      const { idleTimeoutSeconds, maxSessionSeconds } = SESSION_DURATIONS[role];
      assert(idleTimeoutSeconds > 0);
      assert(idleTimeoutSeconds <= maxSessionSeconds);
    });
  });

  it("throws for an unknown role", () => {
    assert.throws(() => getSessionExpiry("janitor", T0, T0), /no session/);
  });
});

describe("signSessionToken / verifySessionToken", () => {
  ALL_ROLES.forEach((role) => {
    it(`${role}: round-trips claims exactly`, () => {
      const claims = claimsFor(role, T0 - 100);
      const token = signSessionToken(claims, T0);
      assert.deepEqual(verifySessionToken(token, T0), claims);

      const payload = decode(token);
      assert.equal(payload.iat, T0);
      assert.equal(
        payload.exp,
        T0 + SESSION_DURATIONS[role].idleTimeoutSeconds
      );
    });

    it(`${role}: token is valid until the second before exp`, () => {
      const token = signSessionToken(claimsFor(role, T0), T0);
      const { exp } = decode(token);
      assert(exp);
      assert.doesNotThrow(() => verifySessionToken(token, exp - 1));
      assert.throws(() => verifySessionToken(token, exp), /jwt expired/);
    });

    it(`${role}: refusing to sign once max session length is reached`, () => {
      const { maxSessionSeconds } = SESSION_DURATIONS[role];
      assert.throws(
        () => signSessionToken(claimsFor(role, T0 - maxSessionSeconds), T0),
        /session expired/
      );
      assert.throws(
        () => signSessionToken(claimsFor(role, T0 - maxSessionSeconds - 1), T0),
        /session expired/
      );
      const lastSecond = signSessionToken(
        claimsFor(role, T0 - maxSessionSeconds + 1),
        T0
      );
      assert.equal(decode(lastSecond).exp, T0 + 1);
    });
  });

  it("rejects a token signed with a different secret", () => {
    const token = jwt.sign(
      { role: ROLES.ADMIN, sessionStartedAt: T0, exp: T0 + 60 },
      "other-secret"
    );
    assert.throws(() => verifySessionToken(token, T0), /invalid signature/);
  });

  it("rejects an unsigned (alg: none) token", () => {
    const token = jwt.sign(
      { role: ROLES.ADMIN, sessionStartedAt: T0, exp: T0 + 60 },
      "",
      { algorithm: "none" }
    );
    assert.throws(() => verifySessionToken(token, T0));
  });

  it("rejects legacy tokens without sessionStartedAt", () => {
    const token = jwt.sign({ role: ROLES.ADMIN, exp: T0 + 60 }, JWT_SECRET);
    assert.throws(() => verifySessionToken(token, T0), /session start/);
  });

  it("rejects a non-numeric sessionStartedAt", () => {
    const token = jwt.sign(
      { role: ROLES.ADMIN, sessionStartedAt: String(T0), exp: T0 + 60 },
      JWT_SECRET
    );
    assert.throws(() => verifySessionToken(token, T0), /session start/);
  });

  it("rejects an unknown role", () => {
    const token = jwt.sign(
      { role: "janitor", sessionStartedAt: T0, exp: T0 + 60 },
      JWT_SECRET
    );
    assert.throws(() => verifySessionToken(token, T0), /unknown role/);
  });

  it("rejects a missing role", () => {
    const token = jwt.sign({ sessionStartedAt: T0, exp: T0 + 60 }, JWT_SECRET);
    assert.throws(() => verifySessionToken(token, T0), /unknown role/);
  });

  it("rejects a participant token without a numeric pid", () => {
    [undefined, String(PID), null].forEach((pid) => {
      const token = jwt.sign(
        { role: ROLES.PARTICIPANT, pid, sessionStartedAt: T0, exp: T0 + 60 },
        JWT_SECRET
      );
      assert.throws(() => verifySessionToken(token, T0), /missing pid/);
    });
  });

  it("drops extra claims from staff tokens", () => {
    const token = jwt.sign(
      { role: ROLES.ADMIN, pid: PID, sessionStartedAt: T0, exp: T0 + 60 },
      JWT_SECRET
    );
    assert.deepEqual(verifySessionToken(token, T0), {
      role: ROLES.ADMIN,
      sessionStartedAt: T0,
    });
  });

  it("rejects a string payload", () => {
    const token = jwt.sign("just-a-string", JWT_SECRET);
    assert.throws(() => verifySessionToken(token, T0));
  });

  it("fails fast when JWT_SECRET is missing", () => {
    delete process.env.JWT_SECRET;
    try {
      assert.throws(
        () => signSessionToken(claimsFor(ROLES.ADMIN, T0), T0),
        /jwt key missing/
      );
      assert.throws(() => verifySessionToken("x.y.z", T0), /jwt key missing/);
    } finally {
      process.env.JWT_SECRET = JWT_SECRET;
    }
  });
});

describe("getBearerToken", () => {
  it("extracts the token", () => {
    assert.equal(getBearerToken("Bearer abc.def.ghi"), "abc.def.ghi");
  });

  [undefined, "", "Bearer", "bearer abc", "Basic abc"].forEach((header) => {
    it(`rejects ${JSON.stringify(header)}`, () => {
      assert.throws(() => getBearerToken(header), /authorization header/);
    });
  });
});

// Resolver tests stub out the Prisma calls the login flow makes.
type Stubs = {
  participant: { pid: number; password: string } | null;
  loggedInToday: boolean;
  loginHistoryCreates: number[];
  badgeProgressLookups: string[];
};

let stubs: Stubs;

function stub(target: object, key: string, value: unknown) {
  Object.defineProperty(target, key, { configurable: true, value });
}

beforeEach(() => {
  stubs = {
    participant: { pid: PID, password: PARTICIPANT_PASSWORD },
    loggedInToday: false,
    loginHistoryCreates: [],
    badgeProgressLookups: [],
  };
  stub(db.participant, "findUnique", async () => stubs.participant);
  stub(db.loginHistory, "findFirst", async () =>
    stubs.loggedInToday ? { pid: PID, date: new Date() } : null
  );
  stub(
    db.loginHistory,
    "create",
    async ({ data }: { data: { pid: number } }) => {
      stubs.loginHistoryCreates.push(data.pid);
      stubs.loggedInToday = true;
      return data;
    }
  );
  // updateBadgeLevelProgress returns early when no progress row exists.
  stub(
    db.badgeLevelProgress,
    "findFirst",
    async ({ where }: { where: { name: string } }) => {
      stubs.badgeProgressLookups.push(where.name);
      return null;
    }
  );
});

after(async () => {
  await db.$disconnect();
});

const { adminLogin, participantLogin, refreshSession } = loginResolver.Mutation;

describe("adminLogin", () => {
  [
    [ROLES.ADMIN, STAFF_PASSWORD],
    [ROLES.RELIEF, RELIEF_PASSWORD],
  ].forEach(([role, password]) => {
    it(`${role}: issues a token for a new idle-timeout session`, async () => {
      const before = nowInSeconds();
      const { token } = await adminLogin(undefined, { role, password });
      const loginFinishedAt = nowInSeconds();
      const payload = decode(token);

      assert.equal(payload.role, role);
      assert.equal(payload.pid, undefined);
      assert(payload.sessionStartedAt >= before);
      assert(payload.sessionStartedAt <= loginFinishedAt);
      assert.equal(payload.iat, payload.sessionStartedAt);
      assert.equal(
        payload.exp,
        payload.sessionStartedAt + SESSION_DURATIONS[role].idleTimeoutSeconds
      );
    });
  });

  it("rejects a wrong password", async () => {
    await assert.rejects(
      adminLogin(undefined, { role: ROLES.ADMIN, password: RELIEF_PASSWORD }),
      /incorrect password/
    );
  });

  it("rejects the participant role", async () => {
    await assert.rejects(
      adminLogin(undefined, {
        role: ROLES.PARTICIPANT,
        password: STAFF_PASSWORD,
      }),
      /invalid role/
    );
  });
});

describe("participantLogin", () => {
  it("issues a participant session token", async () => {
    const { token } = await participantLogin(undefined, {
      pid: PID,
      password: PARTICIPANT_PASSWORD,
    });
    const payload = decode(token);
    assert.equal(payload.role, ROLES.PARTICIPANT);
    assert.equal(payload.pid, PID);
    assert.equal(
      payload.exp,
      payload.sessionStartedAt +
        SESSION_DURATIONS[ROLES.PARTICIPANT].idleTimeoutSeconds
    );
  });

  it("records the first login of the day and advances the login badge", async () => {
    await participantLogin(undefined, {
      pid: PID,
      password: PARTICIPANT_PASSWORD,
    });
    assert.deepEqual(stubs.loginHistoryCreates, [PID]);
    assert.deepEqual(stubs.badgeProgressLookups, [LOGIN]);
  });

  it("does not record a second login on the same day", async () => {
    stubs.loggedInToday = true;
    await participantLogin(undefined, {
      pid: PID,
      password: PARTICIPANT_PASSWORD,
    });
    assert.deepEqual(stubs.loginHistoryCreates, []);
    assert.deepEqual(stubs.badgeProgressLookups, []);
  });

  it("rejects a participant who has left", async () => {
    stubs.participant = null;
    await assert.rejects(
      participantLogin(undefined, { pid: PID, password: PARTICIPANT_PASSWORD }),
      /participant not found/
    );
    assert.deepEqual(stubs.loginHistoryCreates, []);
  });

  it("rejects a wrong password without recording a login", async () => {
    await assert.rejects(
      participantLogin(undefined, { pid: PID, password: "nope" }),
      /incorrect password/
    );
    assert.deepEqual(stubs.loginHistoryCreates, []);
  });
});

describe("refreshSession", () => {
  ALL_ROLES.forEach((role) => {
    it(`${role}: slides expiry forward and keeps the session start`, async () => {
      const now = nowInSeconds();
      const sessionStartedAt = now - 3600;
      const oldToken = signSessionToken(
        claimsFor(role, sessionStartedAt),
        now - 60
      );

      const { token } = await refreshSession(undefined, {}, bearer(oldToken));
      const { iat, exp } = decode(token);
      const oldExp = decode(oldToken).exp;
      assert(iat && exp && oldExp);

      assert.deepEqual(
        verifySessionToken(token),
        claimsFor(role, sessionStartedAt)
      );
      assert(iat >= now);
      assert.equal(exp, iat + SESSION_DURATIONS[role].idleTimeoutSeconds);
      assert(exp > oldExp);
    });

    it(`${role}: does not extend past the max session length`, async () => {
      const now = nowInSeconds();
      const sessionStartedAt =
        now - SESSION_DURATIONS[role].maxSessionSeconds + 120;
      const oldToken = signSessionToken(
        claimsFor(role, sessionStartedAt),
        now - 10
      );

      const { token } = await refreshSession(undefined, {}, bearer(oldToken));
      assert.equal(
        decode(token).exp,
        sessionStartedAt + SESSION_DURATIONS[role].maxSessionSeconds
      );
    });

    it(`${role}: rejects an expired token`, async () => {
      const now = nowInSeconds();
      const { idleTimeoutSeconds } = SESSION_DURATIONS[role];
      const start = now - idleTimeoutSeconds - 10;
      const expired = signSessionToken(claimsFor(role, start), start);
      await assert.rejects(
        refreshSession(undefined, {}, bearer(expired)),
        /jwt expired/
      );
    });
  });

  it("records the first refresh of the day as a daily login", async () => {
    const token = signSessionToken(
      claimsFor(ROLES.PARTICIPANT, nowInSeconds())
    );
    await refreshSession(undefined, {}, bearer(token));
    await refreshSession(undefined, {}, bearer(token));
    assert.deepEqual(stubs.loginHistoryCreates, [PID]);
    assert.deepEqual(stubs.badgeProgressLookups, [LOGIN]);
  });

  it("does not touch login history for staff", async () => {
    const token = signSessionToken(claimsFor(ROLES.ADMIN, nowInSeconds()));
    await refreshSession(undefined, {}, bearer(token));
    assert.deepEqual(stubs.loginHistoryCreates, []);
    assert.deepEqual(stubs.badgeProgressLookups, []);
  });

  it("ends the session of a participant who has left", async () => {
    stubs.participant = null;
    const token = signSessionToken(
      claimsFor(ROLES.PARTICIPANT, nowInSeconds())
    );
    await assert.rejects(
      refreshSession(undefined, {}, bearer(token)),
      /participant not found/
    );
    assert.deepEqual(stubs.loginHistoryCreates, []);
  });

  it("rejects legacy tokens so users log in once more", async () => {
    const legacy = jwt.sign({ role: ROLES.ADMIN }, JWT_SECRET, {
      expiresIn: "12h",
    });
    await assert.rejects(
      refreshSession(undefined, {}, bearer(legacy)),
      /session start/
    );
  });

  it("rejects a missing authorization header", async () => {
    await assert.rejects(
      refreshSession(undefined, {}, { req: { headers: {} } }),
      /authorization header/
    );
  });
});
