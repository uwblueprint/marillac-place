import { after, describe, it } from "node:test";
import assert from "node:assert/strict";
import { Icon, PrismaClient } from "@prisma/client";
import db from "../prisma";
import { resetDatabase, toTestDatabaseUrl } from "./testDatabase";

describe("toTestDatabaseUrl", () => {
  it("appends _test to the database name, keeping everything else", () => {
    assert.equal(
      toTestDatabaseUrl("postgresql://u:p@host:5432/marillac?schema=public"),
      "postgresql://u:p@host:5432/marillac_test?schema=public"
    );
  });

  it("leaves a test database alone", () => {
    assert.equal(
      toTestDatabaseUrl("postgresql://u:p@host:5432/marillac_test"),
      "postgresql://u:p@host:5432/marillac_test"
    );
  });

  [
    undefined,
    "",
    "postgresql://u:p@host:5432",
    "postgresql://u:p@host:5432/",
  ].forEach((url) => {
    it(`rejects ${JSON.stringify(url)}`, () => {
      assert.throws(() => toTestDatabaseUrl(url), /DATABASE_URL/);
    });
  });
});

describe("resetDatabase", () => {
  after(() => db.$disconnect());

  it("runs against the test database", async () => {
    const [{ name }] = await db.$queryRaw<
      { name: string }[]
    >`SELECT current_database() AS name`;
    assert.match(name, /_test$/);
  });

  it("empties tables", async () => {
    await db.systemBadge.create({
      data: { name: "RESET_CHECK", icon: Icon.FIVE_STAR, description: "" },
    });
    await resetDatabase(db);
    assert.equal(await db.systemBadge.count(), 0);
  });

  it("refuses to reset a database that isn't a test database", async () => {
    // Every Postgres server has the "postgres" maintenance database.
    const url = new URL(process.env.DATABASE_URL ?? "");
    url.pathname = "/postgres";
    const other = new PrismaClient({ datasourceUrl: url.toString() });
    try {
      await assert.rejects(
        resetDatabase(other),
        /refusing to reset non-test database "postgres"/
      );
    } finally {
      await other.$disconnect();
    }
  });
});
