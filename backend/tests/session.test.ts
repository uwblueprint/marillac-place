import { after, beforeEach, describe, it } from "node:test";
import assert from "node:assert/strict";
import { AuthenticationError, ForbiddenError } from "apollo-server-express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Prisma } from "@prisma/client";
import * as ROLES from "../constants/roles";
import { LOGIN } from "../constants/systemBadges";
import { getStartOfDay } from "../utils/dateUtils";
import { SESSION_DURATIONS } from "../constants/session";
import db from "../prisma";
import loginResolver from "../gql/resolvers/loginResolver";
import { SESSION_TOKEN_HEADER, slideSession } from "../gql/slideSession";
import getMiddleware from "../gql/middleware";
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

// The frontend ends the session only for UNAUTHENTICATED errors.
function isUnauthenticated(pattern?: RegExp) {
  return (err: unknown) =>
    err instanceof AuthenticationError &&
    err.extensions.code === "UNAUTHENTICATED" &&
    (!pattern || pattern.test(err.message));
}

function assertUnauthenticated(fn: () => unknown, pattern?: RegExp) {
  assert.throws(fn, isUnauthenticated(pattern));
}

async function assertRejectsUnauthenticated(
  promise: Promise<unknown>,
  pattern?: RegExp
) {
  await assert.rejects(promise, isUnauthenticated(pattern));
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
});

describe("signSessionToken / verifySessionToken", () => {
  ALL_ROLES.forEach((role) => {
    it(`${role}: round-trips claims exactly`, () => {
      const claims = claimsFor(role, T0 - 100);
      const token = signSessionToken(claims, T0);
      assert.deepEqual(verifySessionToken(token, T0), {
        claims,
        issuedAt: T0,
      });

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
      assertUnauthenticated(
        () => verifySessionToken(token, exp),
        /jwt expired/
      );
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
    assertUnauthenticated(
      () => verifySessionToken(token, T0),
      /invalid signature/
    );
  });

  it("rejects an unsigned (alg: none) token", () => {
    const token = jwt.sign(
      { role: ROLES.ADMIN, sessionStartedAt: T0, exp: T0 + 60 },
      "",
      { algorithm: "none" }
    );
    assertUnauthenticated(() => verifySessionToken(token, T0));
  });

  it("rejects legacy tokens without sessionStartedAt", () => {
    const token = jwt.sign({ role: ROLES.ADMIN, exp: T0 + 60 }, JWT_SECRET);
    assertUnauthenticated(() => verifySessionToken(token, T0), /session start/);
  });

  it("rejects a non-numeric sessionStartedAt", () => {
    const token = jwt.sign(
      { role: ROLES.ADMIN, sessionStartedAt: String(T0), exp: T0 + 60 },
      JWT_SECRET
    );
    assertUnauthenticated(() => verifySessionToken(token, T0), /session start/);
  });

  it("rejects an unknown role", () => {
    const token = jwt.sign(
      { role: "janitor", sessionStartedAt: T0, exp: T0 + 60 },
      JWT_SECRET
    );
    assertUnauthenticated(() => verifySessionToken(token, T0), /unknown role/);
  });

  it("rejects a missing role", () => {
    const token = jwt.sign({ sessionStartedAt: T0, exp: T0 + 60 }, JWT_SECRET);
    assertUnauthenticated(() => verifySessionToken(token, T0), /unknown role/);
  });

  it("rejects a participant token without a numeric pid", () => {
    [undefined, String(PID), null].forEach((pid) => {
      const token = jwt.sign(
        { role: ROLES.PARTICIPANT, pid, sessionStartedAt: T0, exp: T0 + 60 },
        JWT_SECRET
      );
      assertUnauthenticated(() => verifySessionToken(token, T0), /missing pid/);
    });
  });

  it("drops extra claims from staff tokens", () => {
    const token = jwt.sign(
      { role: ROLES.ADMIN, pid: PID, sessionStartedAt: T0, exp: T0 + 60 },
      JWT_SECRET
    );
    assert.deepEqual(verifySessionToken(token, T0).claims, {
      role: ROLES.ADMIN,
      sessionStartedAt: T0,
    });
  });

  it("rejects a token without an issue time", () => {
    const token = jwt.sign(
      { role: ROLES.ADMIN, sessionStartedAt: T0, exp: T0 + 60 },
      JWT_SECRET,
      { noTimestamp: true }
    );
    assertUnauthenticated(() => verifySessionToken(token, T0), /issue time/);
  });

  it("rejects a string payload", () => {
    const token = jwt.sign("just-a-string", JWT_SECRET);
    assertUnauthenticated(() => verifySessionToken(token, T0));
  });

  it("fails fast when JWT_SECRET is missing", () => {
    delete process.env.JWT_SECRET;
    try {
      assert.throws(
        () => signSessionToken(claimsFor(ROLES.ADMIN, T0), T0),
        /jwt key missing/
      );
      assert.throws(
        () => verifySessionToken("x.y.z", T0),
        (err: Error) =>
          !(err instanceof AuthenticationError) &&
          /jwt key missing/.test(err.message)
      );
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
      assertUnauthenticated(
        () => getBearerToken(header),
        /authorization header/
      );
    });
  });
});

// Resolver tests stub out the Prisma calls the login flow makes.
type Stubs = {
  participant: { pid: number; password: string } | null;
  loginHistoryKeys: Set<string>;
  loginHistoryCreates: { pid: number; date: Date }[];
  loginHistoryError: Error | null;
  badgeProgressLookups: string[];
  badgeError: Error | null;
};

let stubs: Stubs;

function stub(target: object, key: string, value: unknown) {
  Object.defineProperty(target, key, { configurable: true, value });
}

function uniqueViolation() {
  return new Prisma.PrismaClientKnownRequestError("duplicate key", {
    code: "P2002",
    clientVersion: "test",
  });
}

beforeEach(() => {
  stubs = {
    participant: { pid: PID, password: PARTICIPANT_PASSWORD },
    loginHistoryKeys: new Set(),
    loginHistoryCreates: [],
    loginHistoryError: null,
    badgeProgressLookups: [],
    badgeError: null,
  };

  stub(db.participant, "findFirst", async () => stubs.participant);
  // Mirrors the (pid, date) primary key on login_history.
  stub(
    db.loginHistory,
    "create",
    async ({ data }: { data: { pid: number; date: Date } }) => {
      if (stubs.loginHistoryError) throw stubs.loginHistoryError;
      const key = `${data.pid}@${data.date.toISOString()}`;
      if (stubs.loginHistoryKeys.has(key)) throw uniqueViolation();
      stubs.loginHistoryKeys.add(key);
      stubs.loginHistoryCreates.push(data);
      return data;
    }
  );
  stub(
    db.loginHistory,
    "delete",
    async ({
      where: { pid_date: key },
    }: {
      where: { pid_date: { pid: number; date: Date } };
    }) => {
      const removed = stubs.loginHistoryKeys.delete(
        `${key.pid}@${key.date.toISOString()}`
      );
      if (!removed) throw new Error("login_history row not found");
      stubs.loginHistoryCreates = stubs.loginHistoryCreates.filter(
        ({ pid, date }) =>
          pid !== key.pid || date.getTime() !== key.date.getTime()
      );
    }
  );
  // updateBadgeLevelProgress returns early when no progress row exists.
  stub(
    db.badgeLevelProgress,
    "findFirst",
    async ({ where }: { where: { name: string } }) => {
      stubs.badgeProgressLookups.push(where.name);
      if (stubs.badgeError) throw stubs.badgeError;
      return null;
    }
  );
});

function loggedInPids(): number[] {
  return stubs.loginHistoryCreates.map(({ pid }) => pid);
}

after(async () => {
  await db.$disconnect();
});

const { adminLogin, participantLogin } = loginResolver.Mutation;

describe("adminLogin", () => {
  (
    [
      [ROLES.ADMIN, STAFF_PASSWORD],
      [ROLES.RELIEF, RELIEF_PASSWORD],
    ] as const
  ).forEach(([role, password]) => {
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
    assert.deepEqual(loggedInPids(), [PID]);
    assert.deepEqual(stubs.badgeProgressLookups, [LOGIN]);
  });

  it("does not record a second login on the same day", async () => {
    await participantLogin(undefined, {
      pid: PID,
      password: PARTICIPANT_PASSWORD,
    });
    stubs.badgeProgressLookups = [];
    await participantLogin(undefined, {
      pid: PID,
      password: PARTICIPANT_PASSWORD,
    });
    assert.deepEqual(loggedInPids(), [PID]);
    assert.deepEqual(stubs.badgeProgressLookups, []);
  });

  it("stores the login under the start of the day", async () => {
    await participantLogin(undefined, {
      pid: PID,
      password: PARTICIPANT_PASSWORD,
    });
    assert.deepEqual(stubs.loginHistoryCreates, [
      { pid: PID, date: getStartOfDay(new Date()) },
    ]);
  });

  it("undoes the login record when the badge update fails, so it's retried", async () => {
    stubs.badgeError = new Error("badge update failed");
    await assert.rejects(
      participantLogin(undefined, { pid: PID, password: PARTICIPANT_PASSWORD }),
      /badge update failed/
    );
    assert.deepEqual(loggedInPids(), []);

    stubs.badgeError = null;
    stubs.badgeProgressLookups = [];
    await participantLogin(undefined, {
      pid: PID,
      password: PARTICIPANT_PASSWORD,
    });
    assert.deepEqual(loggedInPids(), [PID]);
    assert.deepEqual(stubs.badgeProgressLookups, [LOGIN]);
  });

  it("rejects a participant who has left", async () => {
    stubs.participant = null;
    await assert.rejects(
      participantLogin(undefined, { pid: PID, password: PARTICIPANT_PASSWORD }),
      /participant not found/
    );
    assert.deepEqual(loggedInPids(), []);
  });

  it("rejects a wrong password without recording a login", async () => {
    await assert.rejects(
      participantLogin(undefined, { pid: PID, password: "nope" }),
      /incorrect password/
    );
    assert.deepEqual(loggedInPids(), []);
  });
});

describe("slideSession", () => {
  // Noon in Toronto, so "issued today" is unambiguous.
  const NOON = getStartOfDay(new Date(T0 * 1000)).getTime() / 1000 + 12 * 3600;
  const START_OF_DAY = NOON - 12 * 3600;
  const SLIDE_AFTER = 5 * 60;

  async function slide(
    authorization: string | undefined,
    now = NOON
  ): Promise<string | undefined> {
    const headers: Record<string, string> = {};
    await slideSession(
      { headers: { authorization } },
      {
        setHeader: (name, value) => {
          headers[name] = value;
        },
      },
      now
    );
    return headers[SESSION_TOKEN_HEADER];
  }

  function tokenIssuedAt(
    role: (typeof ALL_ROLES)[number],
    issuedAt: number,
    sessionStartedAt = issuedAt
  ): string {
    return `Bearer ${signSessionToken(
      claimsFor(role, sessionStartedAt),
      issuedAt
    )}`;
  }

  ALL_ROLES.forEach((role) => {
    const { idleTimeoutSeconds, maxSessionSeconds } = SESSION_DURATIONS[role];

    it(`${role}: slides the session once the token is ${SLIDE_AFTER}s old`, async () => {
      const start = NOON - 3600;
      const header = await slide(
        tokenIssuedAt(role, NOON - SLIDE_AFTER, start)
      );
      assert(header);
      assert.deepEqual(verifySessionToken(header, NOON), {
        claims: claimsFor(role, start),
        issuedAt: NOON,
      });
      assert.equal(decode(header).exp, NOON + idleTimeoutSeconds);
    });

    it(`${role}: leaves a fresh token alone`, async () => {
      assert.equal(
        await slide(tokenIssuedAt(role, NOON - SLIDE_AFTER + 1)),
        undefined
      );
    });

    it(`${role}: never slides past the max session length`, async () => {
      const start = NOON - maxSessionSeconds + 60;
      const header = await slide(tokenIssuedAt(role, NOON - 600, start));
      assert(header);
      assert.equal(decode(header).exp, start + maxSessionSeconds);
    });
  });

  it("slides a token issued yesterday right away and records the daily login", async () => {
    const now = START_OF_DAY + 60;
    const header = await slide(
      tokenIssuedAt(ROLES.PARTICIPANT, START_OF_DAY - 60),
      now
    );
    assert(header);
    assert.deepEqual(loggedInPids(), [PID]);
    assert.deepEqual(stubs.badgeProgressLookups, [LOGIN]);
  });

  it("counts concurrent first-of-day requests once", async () => {
    const authorization = tokenIssuedAt(ROLES.PARTICIPANT, NOON - 600);
    await Promise.all(Array.from({ length: 5 }, () => slide(authorization)));
    assert.deepEqual(loggedInPids(), [PID]);
    assert.deepEqual(stubs.badgeProgressLookups, [LOGIN]);
  });

  it("does not touch login history for staff", async () => {
    assert(await slide(tokenIssuedAt(ROLES.ADMIN, NOON - 600)));
    assert.deepEqual(loggedInPids(), []);
    assert.deepEqual(stubs.badgeProgressLookups, []);
  });

  it("doesn't slide a departed participant's session", async () => {
    stubs.participant = null;
    assert.equal(
      await slide(tokenIssuedAt(ROLES.PARTICIPANT, NOON - 600)),
      undefined
    );
    assert.deepEqual(loggedInPids(), []);
  });

  it("ignores requests without a valid session", async () => {
    const legacy = jwt.sign({ role: ROLES.ADMIN }, JWT_SECRET, {
      expiresIn: "12h",
    });
    const expiredAt = NOON - SESSION_DURATIONS[ROLES.ADMIN].idleTimeoutSeconds;
    const authorizations = [
      undefined,
      "",
      "Basic abc",
      "Bearer garbage",
      `Bearer ${legacy}`,
      tokenIssuedAt(ROLES.ADMIN, expiredAt),
    ];
    const headers = await Promise.all(
      authorizations.map((authorization) => slide(authorization))
    );
    assert.deepEqual(
      headers,
      authorizations.map(() => undefined)
    );
  });

  it("surfaces database failures instead of hiding them", async () => {
    stubs.loginHistoryError = new Error("database unavailable");
    await assert.rejects(
      slide(tokenIssuedAt(ROLES.PARTICIPANT, NOON - 600)),
      /database unavailable/
    );
  });

  it("fails fast when JWT_SECRET is missing", async () => {
    const authorization = tokenIssuedAt(ROLES.ADMIN, NOON - 600);
    delete process.env.JWT_SECRET;
    try {
      await assert.rejects(slide(authorization), /jwt key missing/);
    } finally {
      process.env.JWT_SECRET = JWT_SECRET;
    }
  });
});

describe("auth middleware (production)", () => {
  const { Query, Mutation } = getMiddleware();
  const resolved = { ok: true };
  const resolve = async () => resolved;
  const info = {} as Parameters<typeof Query.getNotes>[4];
  let nodeEnv: string | undefined;

  beforeEach(() => {
    nodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";
  });

  after(() => {
    process.env.NODE_ENV = nodeEnv;
  });

  function call(
    middleware: typeof Query.getNotes,
    token: string | null,
    args: Record<string, unknown> = {}
  ) {
    const headers = token ? { authorization: `Bearer ${token}` } : {};
    return middleware(resolve, undefined, args, { req: { headers } }, info);
  }

  it("lets an allowed role through", async () => {
    const token = signSessionToken(claimsFor(ROLES.ADMIN, nowInSeconds()));
    assert.equal(await call(Query.getNotes, token), resolved);
  });

  it("forbids a role that isn't allowed", async () => {
    const token = signSessionToken(claimsFor(ROLES.RELIEF, nowInSeconds()));
    await assert.rejects(
      call(Mutation.createCustomBadge, token),
      (err: unknown) => err instanceof ForbiddenError
    );
  });

  it("lets a participant access their own data", async () => {
    const token = signSessionToken(
      claimsFor(ROLES.PARTICIPANT, nowInSeconds())
    );
    assert.equal(
      await call(Query.getEarningGoal, token, { pid: PID }),
      resolved
    );
  });

  it("forbids a participant from accessing another participant", async () => {
    const token = signSessionToken(
      claimsFor(ROLES.PARTICIPANT, nowInSeconds())
    );
    await assert.rejects(
      call(Query.getEarningGoal, token, { pid: PID + 1 }),
      (err: unknown) => err instanceof ForbiddenError
    );
  });

  it("signs out a participant who has departed", async () => {
    stubs.participant = null;
    const token = signSessionToken(
      claimsFor(ROLES.PARTICIPANT, nowInSeconds())
    );
    await assertRejectsUnauthenticated(
      call(Query.getEarningGoal, token, { pid: PID }),
      /departed/
    );
  });

  it("rejects legacy tokens without a session start", async () => {
    const legacy = jwt.sign({ role: ROLES.ADMIN }, JWT_SECRET, {
      expiresIn: "12h",
    });
    await assertRejectsUnauthenticated(call(Query.getNotes, legacy));
  });

  it("rejects an expired token", async () => {
    const start = nowInSeconds() - 9 * 60 * 60;
    const expired = signSessionToken(claimsFor(ROLES.ADMIN, start), start);
    await assertRejectsUnauthenticated(
      call(Query.getNotes, expired),
      /jwt expired/
    );
  });

  it("rejects a missing token", async () => {
    await assertRejectsUnauthenticated(call(Query.getNotes, null));
  });

  it("passes resolver errors through unchanged", async () => {
    const token = signSessionToken(claimsFor(ROLES.ADMIN, nowInSeconds()));
    const failing = async () => {
      throw new Error("note not found");
    };
    await assert.rejects(
      Query.getNotes(failing, undefined, {}, bearer(token), info),
      /note not found/
    );
  });

  it("skips auth outside production", async () => {
    process.env.NODE_ENV = "development";
    assert.equal(await call(Query.getNotes, null), resolved);
  });
});
