import assert from "node:assert/strict";
import test from "node:test";
import loginResolver from "../../gql/resolvers/loginResolver";
import { withEnv } from "../helpers/env";

test("adminLogin rejects invalid role", async () => {
  await assert.rejects(
    async () =>
      loginResolver.Mutation.adminLogin(undefined, {
        role: "not-a-valid-role",
        password: "irrelevant",
      }),
    /invalid role/
  );
});

test("adminLogin rejects incorrect password", async () => {
  await withEnv(
    { ADMIN_STAFF_PASSWORD: "correct-password", JWT_SECRET: "test-jwt" },
    async () => {
      await assert.rejects(
        async () =>
          loginResolver.Mutation.adminLogin(undefined, {
            role: "admin",
            password: "wrong-password",
          }),
        /incorrect password/
      );
    }
  );
});

test("adminLogin returns signed token for valid admin credentials", async () => {
  await withEnv(
    { ADMIN_STAFF_PASSWORD: "correct-password", JWT_SECRET: "test-jwt" },
    async () => {
      const result = await loginResolver.Mutation.adminLogin(undefined, {
        role: "admin",
        password: "correct-password",
      });
      assert.ok(result.token);
      assert.equal(typeof result.token, "string");
    }
  );
});
