import { after, beforeEach, describe, it } from "node:test";
import assert from "node:assert/strict";
import db from "../prisma";
import processEarning from "../utils/transactionUtils";
import { resetDatabase } from "./testDatabase";

const PID = 7;

describe("processEarning", () => {
  beforeEach(async () => {
    await resetDatabase(db);
    await db.participant.create({
      data: { pid: PID, password: "", room: 1, arrival: new Date() },
    });
  });

  after(() => db.$disconnect());

  async function totals() {
    return db.participant.findUnique({
      where: { pid: PID },
      select: { balance: true, total_earnings: true },
    });
  }

  it("adds the amount to the balance and total earnings", async () => {
    await processEarning(db, PID, 5, "task done");
    assert.deepEqual(await totals(), { balance: 5, total_earnings: 5 });
    assert.equal(await db.transaction.count(), 1);
  });

  it("keeps both earnings when two land at once", async () => {
    // Slowing each update makes the second earning read the balance before
    // the first one's update commits, which is when a lost update happens.
    await db.$executeRawUnsafe(`
      CREATE OR REPLACE FUNCTION slow_update() RETURNS trigger AS $$
      BEGIN PERFORM pg_sleep(0.05); RETURN NEW; END;
      $$ LANGUAGE plpgsql`);
    await db.$executeRawUnsafe(
      `CREATE TRIGGER slow_update BEFORE UPDATE ON participant
       FOR EACH ROW EXECUTE FUNCTION slow_update()`
    );
    try {
      await Promise.all([
        processEarning(db, PID, 5, "first"),
        processEarning(db, PID, 7, "second"),
      ]);
    } finally {
      await db.$executeRawUnsafe(`DROP TRIGGER slow_update ON participant`);
    }
    assert.deepEqual(await totals(), { balance: 12, total_earnings: 12 });
  });

  it("marks the earning goal reached once total earnings meet it", async () => {
    await db.earningGoal.create({
      data: { pid: PID, action: "SET", value: 8 },
    });
    await processEarning(db, PID, 5, "first");
    assert.equal(
      await db.earningGoal.count({ where: { action: "REACHED" } }),
      0
    );
    await processEarning(db, PID, 5, "second");
    assert.equal(
      await db.earningGoal.count({ where: { action: "REACHED" } }),
      1
    );
  });

  [0, -1].forEach((amount) => {
    it(`rejects an amount of ${amount}`, async () => {
      await assert.rejects(
        processEarning(db, PID, amount, "bad"),
        /invalid amount/
      );
    });
  });

  it("rejects an unknown participant", async () => {
    await assert.rejects(
      processEarning(db, PID + 1, 5, "nobody"),
      /participant not found/
    );
  });
});
