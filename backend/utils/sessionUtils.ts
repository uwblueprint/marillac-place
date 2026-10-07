import jwt from "jsonwebtoken";
import * as ROLES from "../constants/roles";
import { SESSION_DURATIONS } from "../constants/session";

// Sessions are sliding: each token expires after the role's idle timeout, and
// the frontend refreshes it while the user is active. sessionStartedAt is
// carried across refreshes so the role's max session length can be enforced.
export type SessionClaims =
  | {
      role: typeof ROLES.ADMIN | typeof ROLES.RELIEF;
      sessionStartedAt: number;
    }
  | {
      role: typeof ROLES.PARTICIPANT;
      pid: number;
      sessionStartedAt: number;
    };

export function nowInSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

function getJwtSecret(): string {
  const jwtSecretKey = process.env.JWT_SECRET ?? "";
  if (!jwtSecretKey) throw new Error("jwt key missing");
  return jwtSecretKey;
}

export function getSessionExpiry(
  role: string,
  sessionStartedAt: number,
  now: number
): number {
  const duration = SESSION_DURATIONS[role];
  if (!duration) throw new Error(`no session duration for role: ${role}`);
  return Math.min(
    now + duration.idleTimeoutSeconds,
    sessionStartedAt + duration.maxSessionSeconds
  );
}

export function signSessionToken(
  claims: SessionClaims,
  now: number = nowInSeconds()
): string {
  const exp = getSessionExpiry(claims.role, claims.sessionStartedAt, now);
  if (exp <= now) throw new Error("session expired");
  return jwt.sign({ ...claims, iat: now, exp }, getJwtSecret());
}

export function verifySessionToken(
  token: string,
  now: number = nowInSeconds()
): SessionClaims {
  const payload = jwt.verify(token, getJwtSecret(), {
    algorithms: ["HS256"],
    clockTimestamp: now,
  });
  if (typeof payload === "string") throw new Error("invalid token payload");

  const { role, pid, sessionStartedAt } = payload;
  if (typeof sessionStartedAt !== "number") {
    throw new Error("token is missing session start");
  }

  switch (role) {
    case ROLES.ADMIN:
    case ROLES.RELIEF:
      return { role, sessionStartedAt };
    case ROLES.PARTICIPANT:
      if (typeof pid !== "number") throw new Error("token is missing pid");
      return { role, pid, sessionStartedAt };
    default:
      throw new Error("token has unknown role");
  }
}

export function getBearerToken(authorization: string | undefined): string {
  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new Error("missing or invalid authorization header");
  }
  return authorization.slice("Bearer ".length);
}
