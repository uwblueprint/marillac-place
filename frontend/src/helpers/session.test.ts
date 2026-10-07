import {
  clearSession,
  getToken,
  msUntilExpiry,
  REFRESH_THROTTLE_MS,
  RefreshResult,
  startSession,
  startSessionKeepAlive,
} from "./session";

const T0 = Date.UTC(2026, 9, 7, 12, 0, 0);
const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

function base64Url(value: object): string {
  return btoa(JSON.stringify(value))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// Unsigned JWT: the frontend only decodes tokens, the backend verifies them.
function makeToken(payload: object): string {
  return `${base64Url({ alg: "HS256", typ: "JWT" })}.${base64Url(
    payload
  )}.signature`;
}

function tokenExpiringAt(ms: number): string {
  return makeToken({ role: "admin", exp: Math.floor(ms / 1000) });
}

function storedToken(): string | null {
  return localStorage.getItem("token");
}

async function flushPromises(): Promise<void> {
  for (let i = 0; i < 5; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    await Promise.resolve();
  }
}

type Deferred = {
  resolve: (result: RefreshResult) => void;
  reject: (err: Error) => void;
};

// Controls the refresh responses the keep-alive sees.
class FakeBackend {
  calls = 0;

  pending: Deferred[] = [];

  refreshToken = (): Promise<RefreshResult> => {
    this.calls += 1;
    return new Promise((resolve, reject) => {
      this.pending.push({ resolve, reject });
    });
  };

  async respond(result: RefreshResult): Promise<void> {
    const next = this.pending.shift();
    if (!next) throw new Error("no pending refresh");
    next.resolve(result);
    await flushPromises();
  }
}

function fireActivity(type = "pointerdown"): void {
  window.dispatchEvent(new Event(type));
}

function setVisibility(state: DocumentVisibilityState): void {
  Object.defineProperty(document, "visibilityState", {
    configurable: true,
    get: () => state,
  });
  document.dispatchEvent(new Event("visibilitychange"));
}

let backend: FakeBackend;
let onSessionEnded: jest.Mock;
let stop: (() => void) | undefined;

function start(): () => void {
  stop = startSessionKeepAlive({
    refreshToken: backend.refreshToken,
    onSessionEnded,
  });
  return stop;
}

beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(T0);
  clearSession();
  backend = new FakeBackend();
  onSessionEnded = jest.fn();
  stop = undefined;
  setVisibility("visible");
});

afterEach(() => {
  stop?.();
  jest.useRealTimers();
});

describe("msUntilExpiry", () => {
  it("returns the time left on a valid token", () => {
    expect(msUntilExpiry(tokenExpiringAt(T0 + HOUR_MS), T0)).toBe(HOUR_MS);
  });

  it("is zero at the moment of expiry and negative after", () => {
    const token = tokenExpiringAt(T0);
    expect(msUntilExpiry(token, T0)).toBe(0);
    expect(msUntilExpiry(token, T0 + 1000)).toBe(-1000);
  });

  it.each([
    ["no token", null],
    ["an empty token", ""],
    ["a malformed token", "not-a-jwt"],
    ["a token without exp", makeToken({ role: "admin" })],
    ["a token with a string exp", makeToken({ exp: "soon" })],
  ])("treats %s as expired", (_label, token) => {
    expect(msUntilExpiry(token, T0)).toBe(0);
  });
});

describe("startSessionKeepAlive", () => {
  it("refreshes immediately and stores the new token", async () => {
    localStorage.setItem("token", tokenExpiringAt(T0 + HOUR_MS));
    start();
    expect(backend.calls).toBe(1);

    const fresh = tokenExpiringAt(T0 + 8 * HOUR_MS);
    await backend.respond({ status: "refreshed", token: fresh });
    expect(storedToken()).toBe(fresh);
    expect(onSessionEnded).not.toHaveBeenCalled();
  });

  it.each([
    ["no token", null],
    ["an expired token", tokenExpiringAt(T0 - 1000)],
    ["a token expiring right now", tokenExpiringAt(T0)],
    ["a malformed token", "garbage"],
  ])("ends the session straight away with %s", (_label, token) => {
    if (token !== null) localStorage.setItem("token", token);
    start();
    expect(onSessionEnded).toHaveBeenCalledTimes(1);
    expect(storedToken()).toBeNull();
    expect(backend.calls).toBe(0);
  });

  it("ends the session exactly when an idle user's token expires", async () => {
    localStorage.setItem("token", tokenExpiringAt(T0 + HOUR_MS));
    start();
    await backend.respond({ status: "failed" });

    jest.advanceTimersByTime(HOUR_MS - 1);
    expect(onSessionEnded).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1);
    expect(onSessionEnded).toHaveBeenCalledTimes(1);
    expect(storedToken()).toBeNull();
  });

  it("throttles refreshes while the user is active", async () => {
    localStorage.setItem("token", tokenExpiringAt(T0 + 8 * HOUR_MS));
    start();
    await backend.respond({
      status: "refreshed",
      token: tokenExpiringAt(T0 + 8 * HOUR_MS),
    });

    jest.advanceTimersByTime(REFRESH_THROTTLE_MS - 1);
    fireActivity();
    expect(backend.calls).toBe(1);

    jest.advanceTimersByTime(1);
    fireActivity();
    expect(backend.calls).toBe(2);
  });

  it.each(["pointerdown", "keydown", "wheel"])(
    "treats %s as activity",
    async (eventType) => {
      localStorage.setItem("token", tokenExpiringAt(T0 + 8 * HOUR_MS));
      start();
      await backend.respond({
        status: "refreshed",
        token: tokenExpiringAt(T0 + 8 * HOUR_MS),
      });
      jest.advanceTimersByTime(REFRESH_THROTTLE_MS);
      fireActivity(eventType);
      expect(backend.calls).toBe(2);
    }
  );

  it("ignores events that aren't user activity", async () => {
    localStorage.setItem("token", tokenExpiringAt(T0 + 8 * HOUR_MS));
    start();
    await backend.respond({
      status: "refreshed",
      token: tokenExpiringAt(T0 + 8 * HOUR_MS),
    });
    jest.advanceTimersByTime(REFRESH_THROTTLE_MS);
    fireActivity("mousemove");
    fireActivity("resize");
    expect(backend.calls).toBe(1);
  });

  it("keeps an active user signed in past the original expiry", async () => {
    localStorage.setItem("token", tokenExpiringAt(T0 + HOUR_MS));
    start();
    await backend.respond({
      status: "refreshed",
      token: tokenExpiringAt(T0 + HOUR_MS),
    });

    // Active every 30 minutes for 5 hours, each refresh sliding expiry 1h ahead.
    for (let i = 1; i <= 10; i += 1) {
      jest.advanceTimersByTime(30 * 60 * 1000);
      fireActivity();
      // eslint-disable-next-line no-await-in-loop
      await backend.respond({
        status: "refreshed",
        token: tokenExpiringAt(Date.now() + HOUR_MS),
      });
    }
    expect(onSessionEnded).not.toHaveBeenCalled();

    // Then goes idle: signed out an hour after the last refresh.
    jest.advanceTimersByTime(HOUR_MS);
    expect(onSessionEnded).toHaveBeenCalledTimes(1);
  });

  it("ends the session when the backend rejects the refresh", async () => {
    localStorage.setItem("token", tokenExpiringAt(T0 + HOUR_MS));
    start();
    await backend.respond({ status: "rejected" });
    expect(onSessionEnded).toHaveBeenCalledTimes(1);
    expect(storedToken()).toBeNull();
  });

  it("keeps the token and retries on next activity when a refresh fails", async () => {
    const token = tokenExpiringAt(T0 + HOUR_MS);
    localStorage.setItem("token", token);
    start();
    await backend.respond({ status: "failed" });
    expect(storedToken()).toBe(token);
    expect(onSessionEnded).not.toHaveBeenCalled();

    // Not throttled, since no refresh succeeded.
    fireActivity();
    expect(backend.calls).toBe(2);
  });

  it("never runs two refreshes at once", async () => {
    localStorage.setItem("token", tokenExpiringAt(T0 + HOUR_MS));
    start();
    fireActivity();
    fireActivity("keydown");
    expect(backend.calls).toBe(1);
    await backend.respond({ status: "failed" });
    fireActivity();
    expect(backend.calls).toBe(2);
  });

  it("shares the throttle between instances (one per page)", async () => {
    localStorage.setItem("token", tokenExpiringAt(T0 + HOUR_MS));
    const stopFirst = start();
    await backend.respond({
      status: "refreshed",
      token: tokenExpiringAt(T0 + HOUR_MS),
    });
    stopFirst();

    start();
    expect(backend.calls).toBe(1);
  });

  it("stop() removes listeners and timers", async () => {
    localStorage.setItem("token", tokenExpiringAt(T0 + HOUR_MS));
    start();
    await backend.respond({ status: "failed" });
    stop?.();

    fireActivity();
    setVisibility("visible");
    jest.advanceTimersByTime(2 * HOUR_MS);
    expect(backend.calls).toBe(1);
    expect(onSessionEnded).not.toHaveBeenCalled();
  });

  it("still saves a refreshed token after stopping (page change mid-refresh)", async () => {
    localStorage.setItem("token", tokenExpiringAt(T0 + HOUR_MS));
    start();
    stop?.();
    const fresh = tokenExpiringAt(T0 + 8 * HOUR_MS);
    await backend.respond({ status: "refreshed", token: fresh });
    expect(storedToken()).toBe(fresh);
  });

  it("does not resurrect a session signed out of mid-refresh", async () => {
    localStorage.setItem("token", tokenExpiringAt(T0 + HOUR_MS));
    start();
    clearSession();
    stop?.();
    await backend.respond({
      status: "refreshed",
      token: tokenExpiringAt(T0 + 8 * HOUR_MS),
    });
    expect(storedToken()).toBeNull();
  });

  it("ends the session on return if it expired while timers were suspended", async () => {
    localStorage.setItem("token", tokenExpiringAt(T0 + HOUR_MS));
    start();
    await backend.respond({ status: "failed" });

    // Phone locked: the clock moves on but no timers fire.
    setVisibility("hidden");
    jest.setSystemTime(T0 + 2 * HOUR_MS);
    expect(onSessionEnded).not.toHaveBeenCalled();

    setVisibility("visible");
    expect(onSessionEnded).toHaveBeenCalledTimes(1);
    expect(backend.calls).toBe(1);
  });

  it("refreshes on return if the session is still valid", async () => {
    localStorage.setItem("token", tokenExpiringAt(T0 + 7 * DAY_MS));
    start();
    await backend.respond({
      status: "refreshed",
      token: tokenExpiringAt(T0 + 7 * DAY_MS),
    });

    setVisibility("hidden");
    jest.setSystemTime(T0 + DAY_MS);
    setVisibility("visible");
    expect(backend.calls).toBe(2);
    expect(onSessionEnded).not.toHaveBeenCalled();
  });

  it("handles expiries beyond setTimeout's maximum delay", async () => {
    localStorage.setItem("token", tokenExpiringAt(T0 + 30 * DAY_MS));
    start();
    await backend.respond({ status: "failed" });

    jest.advanceTimersByTime(30 * DAY_MS - 1000);
    expect(onSessionEnded).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1000);
    expect(onSessionEnded).toHaveBeenCalledTimes(1);
  });

  it("instances started during a refresh share it (one request)", async () => {
    localStorage.setItem("token", tokenExpiringAt(T0 + HOUR_MS));
    start();
    const stopSecond = startSessionKeepAlive({
      refreshToken: backend.refreshToken,
      onSessionEnded,
    });
    fireActivity();
    expect(backend.calls).toBe(1);

    await backend.respond({ status: "rejected" });
    expect(onSessionEnded).toHaveBeenCalledTimes(1);
    expect(storedToken()).toBeNull();
    stopSecond();
  });

  it("a remount mid-refresh (StrictMode) doesn't send a second request", async () => {
    localStorage.setItem("token", tokenExpiringAt(T0 + HOUR_MS));
    const stopFirst = start();
    stopFirst();
    start();
    expect(backend.calls).toBe(1);

    const fresh = tokenExpiringAt(T0 + 8 * HOUR_MS);
    await backend.respond({ status: "refreshed", token: fresh });
    expect(storedToken()).toBe(fresh);

    // The surviving instance follows the new expiry, not the old one.
    jest.advanceTimersByTime(HOUR_MS);
    expect(onSessionEnded).not.toHaveBeenCalled();
    jest.advanceTimersByTime(7 * HOUR_MS);
    expect(onSessionEnded).toHaveBeenCalledTimes(1);
  });

  it("doesn't refresh right after login", () => {
    startSession(tokenExpiringAt(T0 + HOUR_MS));
    start();
    expect(backend.calls).toBe(0);
    jest.advanceTimersByTime(REFRESH_THROTTLE_MS);
    fireActivity();
    expect(backend.calls).toBe(1);
  });

  it("a refresh from a previous session can't overwrite a new login", async () => {
    localStorage.setItem("token", tokenExpiringAt(T0 + HOUR_MS));
    start();
    const newLogin = tokenExpiringAt(T0 + 8 * HOUR_MS);
    startSession(newLogin);
    await backend.respond({
      status: "refreshed",
      token: tokenExpiringAt(T0 + 2 * HOUR_MS),
    });
    expect(getToken()).toBe(newLogin);
  });

  it("a new session doesn't join the previous session's refresh", async () => {
    localStorage.setItem("token", tokenExpiringAt(T0 + HOUR_MS));
    const stopFirst = start();
    stopFirst();
    clearSession();
    localStorage.setItem("token", tokenExpiringAt(T0 + HOUR_MS));
    start();
    expect(backend.calls).toBe(2);
  });

  it("clearSession resets the throttle", async () => {
    localStorage.setItem("token", tokenExpiringAt(T0 + HOUR_MS));
    const stopFirst = start();
    await backend.respond({
      status: "refreshed",
      token: tokenExpiringAt(T0 + HOUR_MS),
    });
    stopFirst();

    clearSession();
    localStorage.setItem("token", tokenExpiringAt(T0 + HOUR_MS));
    start();
    expect(backend.calls).toBe(2);
  });
});
