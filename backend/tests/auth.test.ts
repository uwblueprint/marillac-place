import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  buildSchema,
  graphql,
  GraphQLObjectType,
  GraphQLSchema,
  isObjectType,
} from "graphql";
import jwt from "jsonwebtoken";
import * as ROLES from "../constants/roles";
import getSchema from "../gql/schema";
import getMiddleware, {
  assertEveryOperationHasMiddleware,
} from "../gql/middleware";

const JWT_SECRET = "test-jwt-secret";
const PID = 7;
const OTHER_PID = 8;

const PUBLIC_MUTATIONS = ["adminLogin", "participantLogin"];

function bearer(payload: object) {
  return `Bearer ${jwt.sign(payload, JWT_SECRET)}`;
}

function operationNames(schema: GraphQLSchema, typeName: string) {
  const type = schema.getType(typeName);
  assert(type instanceof GraphQLObjectType);
  return Object.keys(type.getFields());
}

describe("assertEveryOperationHasMiddleware", () => {
  const middleware = {
    Query: { a: async () => null },
    Mutation: { b: async () => null },
  } as unknown as ReturnType<typeof getMiddleware>;

  it("accepts a schema whose operations all have middleware", () => {
    const schema = buildSchema(`
      type Query { a: Int }
      type Mutation { b: Int }
    `);
    assertEveryOperationHasMiddleware(schema, middleware);
  });

  it("rejects a Query with no middleware", () => {
    const schema = buildSchema(`
      type Query { a: Int, unprotected: Int }
      type Mutation { b: Int }
    `);
    assert.throws(
      () => assertEveryOperationHasMiddleware(schema, middleware),
      /Query\.unprotected has no auth/
    );
  });

  it("rejects a Mutation with no middleware", () => {
    const schema = buildSchema(`
      type Query { a: Int }
      type Mutation { b: Int, unprotected: Int }
    `);
    assert.throws(
      () => assertEveryOperationHasMiddleware(schema, middleware),
      /Mutation\.unprotected has no auth/
    );
  });

  it("rejects middleware for an operation that is not in the schema", () => {
    const schema = buildSchema(`
      type Query { a: Int }
      type Mutation { c: Int }
    `);
    assert.throws(
      () => assertEveryOperationHasMiddleware(schema, middleware),
      (err: Error) =>
        /Mutation\.b has auth but is not in the schema/.test(err.message) &&
        /Mutation\.c has no auth/.test(err.message)
    );
  });

  it("rejects a schema without a Mutation type", () => {
    const schema = buildSchema(`type Query { a: Int }`);
    assert.throws(
      () => assertEveryOperationHasMiddleware(schema, middleware),
      /schema is missing the Mutation type/
    );
  });
});

describe("real schema", () => {
  // getSchema itself runs the coverage assertion, so building it is the test.
  const schema = getSchema();
  const middleware = getMiddleware();

  it("builds, so every Query and Mutation has middleware", () => {
    assert.deepEqual(
      operationNames(schema, "Query").sort(),
      Object.keys(middleware.Query).sort()
    );
    assert.deepEqual(
      operationNames(schema, "Mutation").sort(),
      Object.keys(middleware.Mutation).sort()
    );
  });

  it("only the login mutations are public", () => {
    const publicOperations = Object.entries({
      ...middleware.Query,
      ...middleware.Mutation,
    })
      .filter(([, fn]) => fn.name === "allowPublic")
      .map(([name]) => name);
    assert.deepEqual(publicOperations.sort(), PUBLIC_MUTATIONS);
  });

  it("no output type exposes a password field", () => {
    const withPassword = Object.values(schema.getTypeMap())
      .filter(isObjectType)
      .filter((type) => "password" in type.getFields())
      .map((type) => type.name);
    assert.deepEqual(withPassword, []);
  });

  it("Participant cannot be queried for its password", async () => {
    const result = await graphql({
      schema,
      source: `{ getParticipantByPid(pid: ${PID}) { password } }`,
      contextValue: { req: { headers: {} } },
    });
    assert.equal(result.data, undefined);
    assert.match(
      String(result.errors?.[0]?.message),
      /Cannot query field "password" on type "Participant"/
    );
  });
});

describe("auth middleware (production)", () => {
  const schema = getSchema();
  let nodeEnv: string | undefined;
  let jwtSecret: string | undefined;

  before(() => {
    nodeEnv = process.env.NODE_ENV;
    jwtSecret = process.env.JWT_SECRET;
    process.env.NODE_ENV = "production";
    process.env.JWT_SECRET = JWT_SECRET;
  });

  after(() => {
    process.env.NODE_ENV = nodeEnv;
    process.env.JWT_SECRET = jwtSecret;
  });

  async function run(source: string, authorization?: string) {
    return graphql({
      schema,
      source,
      contextValue: {
        req: { headers: authorization ? { authorization } : {} },
      },
    });
  }

  // Each case is denied by the middleware before the resolver touches the DB.
  const getParticipant = `{ getParticipantByPid(pid: ${PID}) { pid } }`;
  const updateTask = `mutation { updateTask(tid: 1, name: "x") { tid } }`;

  const deniedCases: [string, string, string | undefined][] = [
    ["getParticipantByPid without a token", getParticipant, undefined],
    [
      "getParticipantByPid with a bad signature",
      getParticipant,
      `Bearer ${jwt.sign({ role: ROLES.ADMIN }, "wrong-secret")}`,
    ],
    [
      "getParticipantByPid for another participant",
      getParticipant,
      bearer({ role: ROLES.PARTICIPANT, pid: OTHER_PID }),
    ],
    [
      "getParticipantByPid with an unknown role",
      getParticipant,
      bearer({ role: "someone" }),
    ],
    ["updateTask without a token", updateTask, undefined],
    [
      "updateTask as a participant",
      updateTask,
      bearer({ role: ROLES.PARTICIPANT, pid: PID }),
    ],
  ];

  deniedCases.forEach(([name, source, authorization]) => {
    it(`denies ${name}`, async () => {
      const result = await run(source, authorization);
      assert.equal(result.data, null);
      assert.equal(result.errors?.length, 1);
      assert.match(
        String(result.errors?.[0]?.message),
        /authorization header|invalid or expired token/
      );
    });
  });

  // Lets the request through to a stub resolver, without the DB.
  async function passes(
    typeName: "Query" | "Mutation",
    field: string,
    args: Record<string, unknown>,
    authorization?: string
  ) {
    const middleware = getMiddleware()[typeName] as Record<
      string,
      (...a: unknown[]) => Promise<unknown>
    >;
    const resolved = await middleware[field](
      async () => "resolved",
      undefined,
      args,
      { req: { headers: authorization ? { authorization } : {} } },
      {}
    );
    return resolved === "resolved";
  }

  [ROLES.ADMIN, ROLES.RELIEF].forEach((role) => {
    it(`allows ${role} to getParticipantByPid`, async () => {
      assert(
        await passes(
          "Query",
          "getParticipantByPid",
          { pid: PID },
          bearer({ role })
        )
      );
    });

    it(`allows ${role} to updateTask`, async () => {
      assert(
        await passes("Mutation", "updateTask", { tid: 1 }, bearer({ role }))
      );
    });
  });

  it("allows a participant to getParticipantByPid for themself", async () => {
    assert(
      await passes(
        "Query",
        "getParticipantByPid",
        { pid: PID },
        bearer({ role: ROLES.PARTICIPANT, pid: PID })
      )
    );
  });

  PUBLIC_MUTATIONS.forEach((field) => {
    it(`leaves ${field} open without a token`, async () => {
      assert(await passes("Mutation", field, {}));
    });
  });
});
