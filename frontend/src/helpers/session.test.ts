import {
  ApolloLink,
  execute,
  FetchResult,
  from,
  gql,
  Observable,
} from "@apollo/client";
import {
  clearSession,
  createSessionLink,
  endSession,
  getSession,
  getToken,
  msUntilExpiry,
  storeToken,
  watchSessionExpiry,
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

// A token issued now (server and device clocks agree) that expires at `ms`.
function tokenExpiringAt(ms: number): string {
  return makeToken({
    role: "admin",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(ms / 1000),
  });
}

// A token issued by a server whose clock is `skewMs` ahead of this device.
function skewedToken(lifetimeMs: number, skewMs: number): string {
  const iat = Math.floor((Date.now() + skewMs) / 1000);
  return makeToken({ role: "admin", iat, exp: iat + lifetimeMs / 1000 });
}

function setVisibility(state: DocumentVisibilityState): void {
  Object.defineProperty(document, "visibilityState", {
    configurable: true,
    get: () => state,
  });
  document.dispatchEvent(new Event("visibilitychange"));
}

beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(T0);
  clearSession();
  setVisibility("visible");
});

afterEach(() => {
  jest.useRealTimers();
});

describe("storeToken / msUntilExpiry", () => {
  it("returns the time left on a stored token", () => {
    storeToken(tokenExpiringAt(T0 + HOUR_MS));
    expect(msUntilExpiry(T0)).toBe(HOUR_MS);
  });

  it("is zero at the moment of expiry and negative after", () => {
    storeToken(tokenExpiringAt(T0 + HOUR_MS));
    expect(msUntilExpiry(T0 + HOUR_MS)).toBe(0);
    expect(msUntilExpiry(T0 + HOUR_MS + 1000)).toBe(-1000);
  });

  it.each([
    ["10h ahead of", 10 * HOUR_MS],
    ["10h behind", -10 * HOUR_MS],
    ["1 minute ahead of", 60 * 1000],
  ])(
    "uses the token's lifetime when the server clock is %s the device",
    (_label, skewMs) => {
      storeToken(skewedToken(HOUR_MS, skewMs));
      expect(msUntilExpiry(T0)).toBe(HOUR_MS);
    }
  );

  it("measures from when the token was received", () => {
    storeToken(tokenExpiringAt(T0 + HOUR_MS), T0 - 1000);
    expect(msUntilExpiry(T0)).toBe(HOUR_MS - 1000);
  });

  it("treats no token as expired", () => {
    expect(msUntilExpiry(T0)).toBe(0);
  });

  it("treats a token stored without an expiry (pre-deploy) as expired", () => {
    localStorage.setItem("token", tokenExpiringAt(T0 + HOUR_MS));
    expect(msUntilExpiry(T0)).toBe(0);
  });

  it("treats a corrupted expiry as expired", () => {
    storeToken(tokenExpiringAt(T0 + HOUR_MS));
    localStorage.setItem("tokenExpiresAt", "soon");
    expect(msUntilExpiry(T0)).toBe(0);
  });

  it.each([
    ["a malformed token", "not-a-jwt"],
    ["a token without iat", makeToken({ exp: T0 / 1000 + 3600 })],
    ["a token without exp", makeToken({ iat: T0 / 1000 })],
  ])("refuses to store %s", (_label, token) => {
    expect(() => storeToken(token)).toThrow();
    expect(getToken()).toBeNull();
  });

  it("endSession clears the session and loads the login page", () => {
    const assign = jest.fn();
    const realLocation = window.location;
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { ...realLocation, assign },
    });
    try {
      storeToken(tokenExpiringAt(T0 + HOUR_MS));
      endSession("/admin/login");
      expect(getToken()).toBeNull();
      expect(localStorage.getItem("tokenExpiresAt")).toBeNull();
      expect(assign).toHaveBeenCalledWith("/admin/login");
    } finally {
      Object.defineProperty(window, "location", {
        configurable: true,
        value: realLocation,
      });
    }
  });

  it("clearSession removes the token and its expiry", () => {
    storeToken(tokenExpiringAt(T0 + HOUR_MS));
    clearSession();
    expect(getToken()).toBeNull();
    expect(localStorage.getItem("tokenExpiresAt")).toBeNull();
  });
});

describe("getSession", () => {
  // A token for `claims` that has `lifetimeMs` left, from a server whose clock
  // is `skewMs` ahead of this device.
  function storeClaims(claims: object, lifetimeMs = HOUR_MS, skewMs = 0) {
    const iat = Math.floor((Date.now() + skewMs) / 1000);
    storeToken(makeToken({ ...claims, iat, exp: iat + lifetimeMs / 1000 }));
  }

  it.each([
    [{ role: "admin" }, { role: "admin" }],
    [{ role: "relief" }, { role: "relief" }],
    [
      { role: "participant", pid: 7 },
      { role: "participant", pid: 7 },
    ],
  ])("reads %j", (claims, session) => {
    storeClaims(claims);
    expect(getSession()).toEqual(session);
  });

  it.each([
    ["10h ahead of", 10 * HOUR_MS],
    ["10h behind", -10 * HOUR_MS],
  ])(
    "admits a fresh token when the server clock is %s the device",
    (_label, skewMs) => {
      storeClaims({ role: "admin" }, 8 * HOUR_MS, skewMs);
      expect(getSession()).toEqual({ role: "admin" });
    }
  );

  it("ends exactly when the session expires, like msUntilExpiry", () => {
    storeClaims({ role: "admin" });
    expect(getSession(T0 + HOUR_MS - 1)).toEqual({ role: "admin" });
    expect(getSession(T0 + HOUR_MS)).toBeNull();
  });

  it("is null without a token", () => {
    expect(getSession()).toBeNull();
  });

  it("is null for a token stored without an expiry (pre-deploy)", () => {
    localStorage.setItem("token", makeToken({ role: "admin" }));
    expect(getSession()).toBeNull();
  });

  it("is null for a malformed token", () => {
    storeClaims({ role: "admin" });
    localStorage.setItem("token", "not-a-jwt");
    expect(getSession()).toBeNull();
  });

  it.each([
    ["an unknown role", { role: "owner" }],
    ["no role", {}],
    ["a participant without a pid", { role: "participant" }],
    ["a participant with a non-numeric pid", { role: "participant", pid: "7" }],
  ])("is null for %s", (_label, claims) => {
    storeClaims(claims);
    expect(getSession()).toBeNull();
  });
});

describe("watchSessionExpiry", () => {
  let onExpired: jest.Mock;
  let stop: () => void;

  beforeEach(() => {
    onExpired = jest.fn();
  });

  afterEach(() => {
    stop();
  });

  it("fires exactly when the session expires", () => {
    storeToken(tokenExpiringAt(T0 + HOUR_MS));
    stop = watchSessionExpiry(onExpired);
    jest.advanceTimersByTime(HOUR_MS - 1);
    expect(onExpired).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1);
    expect(onExpired).toHaveBeenCalledTimes(1);
  });

  it.each([
    ["no token", () => {}],
    ["an expired token", () => storeToken(tokenExpiringAt(T0 - 1000))],
    ["a token expiring right now", () => storeToken(tokenExpiringAt(T0))],
    [
      "a token without a stored expiry",
      () => localStorage.setItem("token", "garbage"),
    ],
  ])("fires straight away with %s", (_label, seed) => {
    seed();
    stop = watchSessionExpiry(onExpired);
    expect(onExpired).toHaveBeenCalledTimes(1);
  });

  it("follows the expiry as requests slide the session", () => {
    storeToken(tokenExpiringAt(T0 + HOUR_MS));
    stop = watchSessionExpiry(onExpired);

    jest.advanceTimersByTime(30 * 60 * 1000);
    storeToken(tokenExpiringAt(Date.now() + HOUR_MS));

    jest.advanceTimersByTime(HOUR_MS - 1);
    expect(onExpired).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1);
    expect(onExpired).toHaveBeenCalledTimes(1);
  });

  it.each([
    ["ahead", 10 * HOUR_MS],
    ["behind", -10 * HOUR_MS],
  ])(
    "keeps the full session when the server clock is 10h %s",
    (_label, skewMs) => {
      storeToken(skewedToken(8 * HOUR_MS, skewMs));
      stop = watchSessionExpiry(onExpired);
      jest.advanceTimersByTime(8 * HOUR_MS - 1);
      expect(onExpired).not.toHaveBeenCalled();
      jest.advanceTimersByTime(1);
      expect(onExpired).toHaveBeenCalledTimes(1);
    }
  );

  it("fires on return if the session expired while timers were suspended", () => {
    storeToken(tokenExpiringAt(T0 + HOUR_MS));
    stop = watchSessionExpiry(onExpired);

    // Phone locked: the clock moves on but no timers fire.
    setVisibility("hidden");
    jest.setSystemTime(T0 + 2 * HOUR_MS);
    expect(onExpired).not.toHaveBeenCalled();

    setVisibility("visible");
    expect(onExpired).toHaveBeenCalledTimes(1);
  });

  it("doesn't fire on return if the session is still valid", () => {
    storeToken(tokenExpiringAt(T0 + 7 * DAY_MS));
    stop = watchSessionExpiry(onExpired);
    setVisibility("hidden");
    jest.setSystemTime(T0 + DAY_MS);
    setVisibility("visible");
    expect(onExpired).not.toHaveBeenCalled();
  });

  it("handles expiries beyond setTimeout's maximum delay", () => {
    storeToken(tokenExpiringAt(T0 + 30 * DAY_MS));
    stop = watchSessionExpiry(onExpired);
    jest.advanceTimersByTime(30 * DAY_MS - 1000);
    expect(onExpired).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1000);
    expect(onExpired).toHaveBeenCalledTimes(1);
  });

  it("stop() removes the timer and the visibility listener", () => {
    storeToken(tokenExpiringAt(T0 + HOUR_MS));
    stop = watchSessionExpiry(onExpired);
    stop();
    jest.advanceTimersByTime(2 * HOUR_MS);
    setVisibility("visible");
    expect(onExpired).not.toHaveBeenCalled();
  });
});

describe("createSessionLink", () => {
  type ServerReply = {
    token?: string;
    errors?: { message: string; extensions?: { code?: string } }[];
    networkError?: Error;
    delayMs?: number;
  };

  // Stands in for the HTTP link: replies with an optional session header.
  function fakeServer(reply: ServerReply): ApolloLink {
    return new ApolloLink(
      (operation) =>
        new Observable<FetchResult>((observer) => {
          const respond = () => {
            if (reply.networkError) {
              observer.error(reply.networkError);
              return;
            }
            operation.setContext({
              response: {
                headers: {
                  get: (name: string) =>
                    name === "x-session-token" ? reply.token ?? null : null,
                },
              },
            });
            observer.next(
              reply.errors
                ? ({ errors: reply.errors } as unknown as FetchResult)
                : { data: { ok: true } }
            );
            observer.complete();
          };
          if (reply.delayMs) setTimeout(respond, reply.delayMs);
          else respond();
        })
    );
  }

  const UNAUTHENTICATED = {
    message: "expired",
    extensions: { code: "UNAUTHENTICATED" },
  };
  let onUnauthenticated: jest.Mock;

  beforeEach(() => {
    onUnauthenticated = jest.fn();
  });

  function request(reply: ServerReply): Promise<void> {
    const link = from([
      createSessionLink(onUnauthenticated),
      fakeServer(reply),
    ]);
    return new Promise((resolve) => {
      execute(link, {
        query: gql`
          query Ping {
            ok
          }
        `,
      }).subscribe({ complete: resolve, error: () => resolve() });
    });
  }

  it("saves the fresh token from the response header", async () => {
    storeToken(tokenExpiringAt(T0 + HOUR_MS));
    const slid = tokenExpiringAt(T0 + 8 * HOUR_MS);
    await request({ token: slid });
    expect(getToken()).toBe(slid);
    expect(msUntilExpiry(T0)).toBe(8 * HOUR_MS);
  });

  it("measures the fresh token from when the request was sent", async () => {
    storeToken(tokenExpiringAt(T0 + HOUR_MS));
    const done = request({
      token: skewedToken(8 * HOUR_MS, 0),
      delayMs: 2000,
    });
    jest.advanceTimersByTime(2000);
    await done;
    expect(msUntilExpiry(Date.now())).toBe(8 * HOUR_MS - 2000);
  });

  it("leaves the token alone when the response has no header", async () => {
    const token = tokenExpiringAt(T0 + HOUR_MS);
    storeToken(token);
    await request({});
    expect(getToken()).toBe(token);
  });

  it("doesn't bring back a session signed out of mid-request", async () => {
    storeToken(tokenExpiringAt(T0 + HOUR_MS));
    const done = request({
      token: tokenExpiringAt(T0 + 8 * HOUR_MS),
      delayMs: 1000,
    });
    clearSession();
    jest.advanceTimersByTime(1000);
    await done;
    expect(getToken()).toBeNull();
  });

  it("doesn't overwrite a new login with a reply from the old session", async () => {
    storeToken(tokenExpiringAt(T0 + HOUR_MS));
    const done = request({
      token: tokenExpiringAt(T0 + 2 * HOUR_MS),
      delayMs: 1000,
    });
    const newLogin = tokenExpiringAt(T0 + 8 * HOUR_MS);
    storeToken(newLogin);
    jest.advanceTimersByTime(1000);
    await done;
    expect(getToken()).toBe(newLogin);
  });

  it("doesn't start a session from a request sent while signed out", async () => {
    await request({ token: tokenExpiringAt(T0 + 8 * HOUR_MS) });
    expect(getToken()).toBeNull();
  });

  it("keeps the first fresh token when overlapping requests both slide", async () => {
    storeToken(tokenExpiringAt(T0 + HOUR_MS));
    const first = tokenExpiringAt(T0 + 8 * HOUR_MS);
    const firstDone = request({ token: first, delayMs: 1000 });
    const secondDone = request({
      token: tokenExpiringAt(T0 + 7 * HOUR_MS),
      delayMs: 2000,
    });
    jest.advanceTimersByTime(2000);
    await Promise.all([firstDone, secondDone]);
    expect(getToken()).toBe(first);
  });

  it.each([
    [
      "an UNAUTHENTICATED error",
      [{ message: "expired", extensions: { code: "UNAUTHENTICATED" } }],
    ],
    [
      "UNAUTHENTICATED among other errors",
      [
        { message: "boom", extensions: { code: "INTERNAL_SERVER_ERROR" } },
        { message: "expired", extensions: { code: "UNAUTHENTICATED" } },
      ],
    ],
  ])("ends the session after %s", async (_label, errors) => {
    await request({ errors });
    expect(onUnauthenticated).toHaveBeenCalledTimes(1);
  });

  it("ends the current session after an UNAUTHENTICATED reply", async () => {
    storeToken(tokenExpiringAt(T0 + HOUR_MS));
    await request({ errors: [UNAUTHENTICATED] });
    expect(onUnauthenticated).toHaveBeenCalledTimes(1);
  });

  it("doesn't end a new login because the old session's request was rejected", async () => {
    storeToken(tokenExpiringAt(T0 + HOUR_MS));
    const done = request({ errors: [UNAUTHENTICATED], delayMs: 1000 });
    const newLogin = tokenExpiringAt(T0 + 8 * HOUR_MS);
    storeToken(newLogin);
    jest.advanceTimersByTime(1000);
    await done;
    expect(onUnauthenticated).not.toHaveBeenCalled();
    expect(getToken()).toBe(newLogin);
  });

  it("doesn't end a session started after a signed-out request was rejected", async () => {
    const done = request({ errors: [UNAUTHENTICATED], delayMs: 1000 });
    storeToken(tokenExpiringAt(T0 + 8 * HOUR_MS));
    jest.advanceTimersByTime(1000);
    await done;
    expect(onUnauthenticated).not.toHaveBeenCalled();
  });

  it("doesn't save a token from an UNAUTHENTICATED reply", async () => {
    const token = tokenExpiringAt(T0 + HOUR_MS);
    storeToken(token);
    await request({
      errors: [UNAUTHENTICATED],
      token: tokenExpiringAt(T0 + 8 * HOUR_MS),
    });
    expect(getToken()).toBe(token);
  });

  it.each([
    [
      "a forbidden error",
      [{ message: "no", extensions: { code: "FORBIDDEN" } }],
    ],
    [
      "a server error",
      [{ message: "boom", extensions: { code: "INTERNAL_SERVER_ERROR" } }],
    ],
    ["an error without a code", [{ message: "boom" }]],
  ])("keeps the session after %s", async (_label, errors) => {
    await request({ errors });
    expect(onUnauthenticated).not.toHaveBeenCalled();
  });

  it("keeps the session after a network error", async () => {
    await request({ networkError: new Error("offline") });
    expect(onUnauthenticated).not.toHaveBeenCalled();
  });

  it("keeps the session after a successful request", async () => {
    await request({});
    expect(onUnauthenticated).not.toHaveBeenCalled();
  });
});
