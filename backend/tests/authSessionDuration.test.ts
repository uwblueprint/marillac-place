import assert from "assert";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Participant } from "@prisma/client";
import * as ROLES from "../constants/roles";

const EXPECTED_SESSION_DURATION_SECONDS = 7 * 24 * 60 * 60;
const TEST_PASSWORD = "test-password";
const TEST_PID = 123;

function getTokenDurationSeconds(token: string): number {
  const decodedToken = jwt.decode(token);
  assert(decodedToken, "Expected login token to be decodable");
  assert.notStrictEqual(
    typeof decodedToken,
    "string",
    "Expected login token payload to be an object"
  );

  const payload = decodedToken as JwtPayload;
  const issuedAt = payload.iat;
  const expiresAt = payload.exp;

  if (typeof issuedAt !== "number") {
    throw new Error("Expected token to include iat");
  }

  if (typeof expiresAt !== "number") {
    throw new Error("Expected token to include exp");
  }

  return expiresAt - issuedAt;
}

function assertTokenDuration(token: string, loginName: string): void {
  const actualDurationSeconds = getTokenDurationSeconds(token);

  assert.strictEqual(
    actualDurationSeconds,
    EXPECTED_SESSION_DURATION_SECONDS,
    `${loginName} should issue a 7-day JWT, but issued one for ${actualDurationSeconds} seconds`
  );
}

async function run(): Promise<void> {
  process.env.JWT_SECRET = "test-jwt-secret";
  process.env.ADMIN_STAFF_PASSWORD = TEST_PASSWORD;
  delete process.env.JWT_EXPIRES_IN;

  const [{ default: loginResolver }, { default: db }] = await Promise.all([
    import("../gql/resolvers/loginResolver"),
    import("../prisma"),
  ]);

  Object.defineProperty(db.participant, "findUnique", {
    configurable: true,
    value: async () =>
      ({
        pid: TEST_PID,
        password: TEST_PASSWORD,
      } as Participant),
  });
  Object.defineProperty(db.loginHistory, "findFirst", {
    configurable: true,
    value: async () => ({ id: 1 }),
  });
  Object.defineProperty(db.loginHistory, "create", {
    configurable: true,
    value: async () => ({ id: 1 }),
  });

  try {
    const adminLoginResult = await loginResolver.Mutation.adminLogin(
      undefined,
      {
        role: ROLES.ADMIN,
        password: TEST_PASSWORD,
      }
    );
    assertTokenDuration(adminLoginResult.token, "adminLogin");

    const participantLoginResult =
      await loginResolver.Mutation.participantLogin(undefined, {
        pid: TEST_PID,
        password: TEST_PASSWORD,
      });
    assertTokenDuration(participantLoginResult.token, "participantLogin");
  } finally {
    await db.$disconnect();
  }
}

run()
  .then(() => {
    console.log("auth session duration test passed");
  })
  .catch((err: Error) => {
    console.error(err.message);
    process.exit(1);
  });
