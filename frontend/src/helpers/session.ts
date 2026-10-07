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
  // Something else went wrong (network, server error): keep the current
  // token and retry on the next activity.
  | { status: "failed" };

// Module state is shared by every keep-alive instance (each page's route
// guard starts its own) so they throttle and refresh together.
let lastRefreshAt: number | null = null;
// Bumped whenever a session starts or is cleared, so a refresh from an
// earlier session can't overwrite or bring back the current one.
let sessionGeneration = 0;
let inFlightRefresh: {
  generation: number;
  promise: Promise<RefreshResult>;
} | null = null;

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function startSession(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
  lastRefreshAt = Date.now();
  sessionGeneration += 1;
}

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

// Starts a refresh, or joins the one already running for this session.
function sharedRefresh(
  refreshToken: () => Promise<RefreshResult>
): Promise<RefreshResult> {
  if (inFlightRefresh && inFlightRefresh.generation === sessionGeneration) {
    return inFlightRefresh.promise;
  }

  const generation = sessionGeneration;
  const promise = refreshToken()
    .then((result) => {
      if (result.status === "refreshed" && generation === sessionGeneration) {
        localStorage.setItem(TOKEN_KEY, result.token);
        lastRefreshAt = Date.now();
      }
      return result;
    })
    .finally(() => {
      if (inFlightRefresh?.promise === promise) inFlightRefresh = null;
    });
  inFlightRefresh = { generation, promise };
  return promise;
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
  let expiryTimer: ReturnType<typeof setTimeout> | undefined;

  const stop = () => {
    stopped = true;
    clearTimeout(expiryTimer);
    ACTIVITY_EVENTS.forEach((event) =>
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      window.removeEventListener(event, onActivity)
    );
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    document.removeEventListener("visibilitychange", onVisibilityChange);
  };

  const endSession = () => {
    stop();
    clearSession();
    onSessionEnded();
  };

  const checkExpiry = () => {
    clearTimeout(expiryTimer);
    const remaining = msUntilExpiry(getToken(), Date.now());
    if (remaining <= 0) {
      endSession();
      return;
    }
    expiryTimer = setTimeout(checkExpiry, Math.min(remaining, MAX_TIMEOUT_MS));
  };

  const refresh = async () => {
    if (stopped) return;
    const joining =
      inFlightRefresh !== null &&
      inFlightRefresh.generation === sessionGeneration;
    if (
      !joining &&
      lastRefreshAt !== null &&
      Date.now() - lastRefreshAt < REFRESH_THROTTLE_MS
    ) {
      return;
    }

    const generation = sessionGeneration;
    const result = await sharedRefresh(refreshToken);
    // Stopped (page change) or a different session now: not ours to act on.
    if (stopped || generation !== sessionGeneration) return;

    switch (result.status) {
      case "refreshed":
        checkExpiry();
        return;
      case "rejected":
        endSession();
        return;
      case "failed":
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

  ACTIVITY_EVENTS.forEach((event) =>
    window.addEventListener(event, onActivity, { passive: true })
  );
  document.addEventListener("visibilitychange", onVisibilityChange);
  checkExpiry();
  refresh();

  return stop;
}
