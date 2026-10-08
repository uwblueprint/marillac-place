import { AuthenticationError } from "apollo-server-express";
import * as ROLES from "../constants/roles";
import { getStartOfDay } from "../utils/dateUtils";
import { recordDailyLogin } from "../utils/loginUtils";
import { findCurrentParticipant } from "../utils/participantUtils";
import {
  nowInSeconds,
  signSessionToken,
  verifySessionToken,
} from "../utils/sessionUtils";

export const SESSION_TOKEN_HEADER = "x-session-token";

// Re-issue tokens at most this often.
const SLIDE_AFTER_SECONDS = 5 * 60;

type SlideRequest = { headers: { authorization?: string } };
type SlideResponse = { setHeader: (name: string, value: string) => void };

// Sessions are sliding: every authenticated request is activity, so we hand
// back a fresh token in a response header. Requests without a valid session
// are left alone here; resolvers that need one reject them.
export async function slideSession(
  req: SlideRequest,
  res: SlideResponse,
  now: number = nowInSeconds()
): Promise<void> {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) return;

  let session;
  try {
    session = verifySessionToken(authorization.slice("Bearer ".length), now);
  } catch (err) {
    if (err instanceof AuthenticationError) return;
    throw err;
  }
  const { claims, issuedAt } = session;

  // Always re-issue a token from an earlier day, even if it's recent, so each
  // day's first request records the daily login. Otherwise a request at
  // 12:01am on an 11:58pm token would be skipped, and that day could go
  // unrecorded.
  const issuedBeforeToday =
    issuedAt * 1000 < getStartOfDay(new Date(now * 1000)).getTime();
  if (now - issuedAt < SLIDE_AFTER_SECONDS && !issuedBeforeToday) return;

  if (claims.role === ROLES.PARTICIPANT) {
    if (!(await findCurrentParticipant(claims.pid))) return;
    await recordDailyLogin(claims.pid);
  }
  res.setHeader(SESSION_TOKEN_HEADER, signSessionToken(claims, now));
}
