import * as ROLES from "./roles";

const HOUR_SECONDS = 60 * 60;
const DAY_SECONDS = 24 * HOUR_SECONDS;

export type SessionDuration = {
  // A session ends after this long without activity (activity refreshes the token).
  idleTimeoutSeconds: number;
  // A session can never last longer than this from login, regardless of activity.
  maxSessionSeconds: number;
};

// Staff mostly use the app on desktop computers (possibly shared), so their
// sessions are shorter. Participants use the app on their own phones.
export const SESSION_DURATIONS: Record<string, SessionDuration> = {
  [ROLES.ADMIN]: {
    idleTimeoutSeconds: 8 * HOUR_SECONDS,
    maxSessionSeconds: 7 * DAY_SECONDS,
  },
  [ROLES.RELIEF]: {
    idleTimeoutSeconds: 8 * HOUR_SECONDS,
    maxSessionSeconds: 7 * DAY_SECONDS,
  },
  [ROLES.PARTICIPANT]: {
    idleTimeoutSeconds: 7 * DAY_SECONDS,
    maxSessionSeconds: 30 * DAY_SECONDS,
  },
};
