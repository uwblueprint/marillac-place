import { jwtDecode } from "jwt-decode";

// Sessions are sliding: the backend issues tokens that expire after an idle
// timeout, and while the user is active we swap the token for a fresh one.
// See backend/constants/session.ts for the durations.

const TOKEN_KEY = "token";

// Refresh at most this often while the user is active.
export const REFRESH_THROTTLE_MS = 5 * 60 * 1000;

// setTimeout fires immediately for delays above this (~24.8 days).
const MAX_TIMEOUT_MS = 2 ** 31 - 1;

const ACTIVITY_EVENTS = ["pointerdown", "keydown", "wheel"] as const;

export type RefreshResult =
  // The backend issued a new token.
  | { status: "refreshed"; token: string }
  // The backend refused to refresh: the session is over.
  | { status: "rejected" }
  // The backend couldn't be reached: keep the current token and retry on the
  // next activity.
  | { status: "unreachable" };

// Shared across keep-alive instances, since each page's route guard starts its own.
let lastRefreshAt: number | null = null;
// Bumped whenever the session is cleared, so an in-flight refresh can't
// bring back a session the user has signed out of.
let sessionGeneration = 0;

export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  lastRefreshAt = null;
  sessionGeneration += 1;
}

// Milliseconds until the token expires; zero or less if it is expired or unreadable.
export function msUntilExpiry(token: string | null, now: number): number {
  if (!token) return 0;
  try {
    const { exp } = jwtDecode(token);
    if (typeof exp !== "number") return 0;
    return exp * 1000 - now;
  } catch (err) {
    return 0;
  }
}

type KeepAliveOptions = {
  refreshToken: () => Promise<RefreshResult>;
  onSessionEnded: () => void;
};

// Keeps the session alive while the user is active, and ends it once the
// token expires. Returns a function that stops it.
export function startSessionKeepAlive({
  refreshToken,
  onSessionEnded,
}: KeepAliveOptions): () => void {
  let stopped = false;
  let refreshing = false;
  let expiryTimer: ReturnType<typeof setTimeout> | undefined;

  const checkExpiry = () => {
    clearTimeout(expiryTimer);
    const remaining = msUntilExpiry(
      localStorage.getItem(TOKEN_KEY),
      Date.now()
    );
    if (remaining <= 0) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      endSession();
      return;
    }
    expiryTimer = setTimeout(checkExpiry, Math.min(remaining, MAX_TIMEOUT_MS));
  };

  const refresh = async () => {
    if (stopped || refreshing) return;
    if (
      lastRefreshAt !== null &&
      Date.now() - lastRefreshAt < REFRESH_THROTTLE_MS
    ) {
      return;
    }

    const generation = sessionGeneration;
    refreshing = true;
    let result: RefreshResult;
    try {
      result = await refreshToken();
    } finally {
      refreshing = false;
    }
    if (generation !== sessionGeneration) return;

    switch (result.status) {
      case "refreshed":
        // Saved even if this instance stopped meanwhile (e.g. the user moved
        // to another page): the token is still valid for the session.
        localStorage.setItem(TOKEN_KEY, result.token);
        lastRefreshAt = Date.now();
        if (!stopped) checkExpiry();
        return;
      case "rejected":
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        if (!stopped) endSession();
        return;
      case "unreachable":
        return;
      default:
        throw new Error(`unknown refresh result: ${JSON.stringify(result)}`);
    }
  };

  const onActivity = () => {
    refresh();
  };

  const onVisibilityChange = () => {
    // Phones suspend timers in the background, so re-check on return.
    if (document.visibilityState !== "visible") return;
    checkExpiry();
    refresh();
  };

  const stop = () => {
    stopped = true;
    clearTimeout(expiryTimer);
    ACTIVITY_EVENTS.forEach((event) =>
      window.removeEventListener(event, onActivity)
    );
    document.removeEventListener("visibilitychange", onVisibilityChange);
  };

  function endSession() {
    stop();
    clearSession();
    onSessionEnded();
  }

  ACTIVITY_EVENTS.forEach((event) =>
    window.addEventListener(event, onActivity, { passive: true })
  );
  document.addEventListener("visibilitychange", onVisibilityChange);
  checkExpiry();
  refresh();

  return stop;
}
