import { ApolloLink } from "@apollo/client";
import { jwtDecode } from "jwt-decode";
import { ADMIN, PARTICIPANT, RELIEF } from "../constants/roles";

// Sessions are sliding: authenticated requests come back with a fresh token in
// a response header (see backend/gql/slideSession.ts), and the session ends
// after the role's idle timeout without requests.

const TOKEN_KEY = "token";
// Local time the token expires, so the device clock never has to agree with
// the server's.
const EXPIRES_AT_KEY = "tokenExpiresAt";
const SESSION_TOKEN_HEADER = "x-session-token";

// setTimeout fires immediately for delays above this (~24.8 days).
const MAX_TIMEOUT_MS = 2 ** 31 - 1;

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

// Saves a token received at `receivedAt` (local time). Its expiry is measured
// from then using the token's lifetime (exp - iat), not the server's clock.
export function storeToken(token: string, receivedAt = Date.now()): void {
  const { iat, exp } = jwtDecode(token);
  if (typeof iat !== "number" || typeof exp !== "number") {
    throw new Error("session token is missing iat or exp");
  }
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(EXPIRES_AT_KEY, String(receivedAt + (exp - iat) * 1000));
}

export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EXPIRES_AT_KEY);
}

// Signs out with a full page load, so no cached data from the session survives.
export function endSession(loginPage: string): void {
  clearSession();
  window.location.assign(loginPage);
}

// Milliseconds until the stored token expires; zero or less if it has expired
// or there's no usable token.
export function msUntilExpiry(now: number): number {
  if (!getToken()) return 0;
  const expiresAt = Number(localStorage.getItem(EXPIRES_AT_KEY) ?? NaN);
  if (!Number.isFinite(expiresAt)) return 0;
  return expiresAt - now;
}

export type Session =
  | { role: typeof ADMIN | typeof RELIEF }
  | { role: typeof PARTICIPANT; pid: number };

// Who's signed in, or null if no one is or the session has expired (measured
// the same way as msUntilExpiry). The token is only read, not verified: the
// backend checks it on every request, so this decides what to show, not what
// is allowed.
export function getSession(now = Date.now()): Session | null {
  const token = getToken();
  if (!token || msUntilExpiry(now) <= 0) return null;
  let claims: { role?: unknown; pid?: unknown };
  try {
    claims = jwtDecode(token);
  } catch {
    return null;
  }
  switch (claims.role) {
    case ADMIN:
    case RELIEF:
      return { role: claims.role };
    case PARTICIPANT:
      return typeof claims.pid === "number"
        ? { role: PARTICIPANT, pid: claims.pid }
        : null;
    default:
      return null;
  }
}

// Saves the fresh tokens the backend sends back, and ends the session when the
// backend says it's over. Both apply only while the token the request was
// sent with is still the stored one: if the user signed out or in again
// meanwhile (in any tab), the reply is about a session that's gone.
export function createSessionLink(onUnauthenticated: () => void): ApolloLink {
  return new ApolloLink((operation, forward) => {
    const sentToken = getToken();
    // Measuring the lifetime from when the request was sent means latency can
    // only make the token expire early locally, never late.
    const sentAt = Date.now();
    return forward(operation).map((result) => {
      if (getToken() !== sentToken) return result;
      const unauthenticated = result.errors?.some(
        (error) => error.extensions?.code === "UNAUTHENTICATED"
      );
      if (unauthenticated) {
        onUnauthenticated();
        return result;
      }
      const token = operation
        .getContext()
        .response?.headers.get(SESSION_TOKEN_HEADER);
      if (token && sentToken !== null) storeToken(token, sentAt);
      return result;
    });
  });
}

// Calls onExpired once the session expires, so an idle screen doesn't keep
// showing data. Returns a function that stops watching.
export function watchSessionExpiry(onExpired: () => void): () => void {
  let expiryTimer: ReturnType<typeof setTimeout> | undefined;

  const onVisibilityChange = () => {
    // Phones suspend timers in the background, so re-check on return.
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    if (document.visibilityState === "visible") checkExpiry();
  };

  const stop = () => {
    clearTimeout(expiryTimer);
    document.removeEventListener("visibilitychange", onVisibilityChange);
  };

  // Requests keep sliding the expiry, so re-read it whenever the timer fires.
  const checkExpiry = () => {
    clearTimeout(expiryTimer);
    const remaining = msUntilExpiry(Date.now());
    if (remaining <= 0) {
      stop();
      onExpired();
      return;
    }
    expiryTimer = setTimeout(checkExpiry, Math.min(remaining, MAX_TIMEOUT_MS));
  };

  document.addEventListener("visibilitychange", onVisibilityChange);
  checkExpiry();
  return stop;
}
