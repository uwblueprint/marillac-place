import { createSeedClient } from "@snaplet/seed";
import { Priority, TaskType } from "@prisma/client";
import { badgeLevels, systemBadges, tasks } from "./initialData";
import db from "../index";
import * as random from "./random";
import { initBadgeLevelProgress } from "../../utils/badgeUtils";
import { assignTasksToParticipants } from "../../utils/taskUtils";

async function initDb() {
  const systemBadgeCount = await db.systemBadge.count();
  const initialized = systemBadgeCount !== 0;
  if (!initialized) {
    await Promise.all(
      systemBadges.map(async (systemBadge) => {
        return db.systemBadge.create({
          data: systemBadge,
        });
      })
    );

    await Promise.all(
      badgeLevels.map(async (badgeLevel) => {
        return db.badgeLevel.create({
          data: badgeLevel,
        });
      })
    );

    await Promise.all(
      tasks.map(async (task) => {
        return db.task.create({
          data: task,
        });
      })
    );
  }
}

async function generateMockData(seed: any) {
  const participants = await seed.participant((createMany: any) =>
    createMany(10, (ret: any) => ({
      pid: ret.index + 1,
      password: random.password(),
      room: ret.index + 1,
      arrival: random.date(),
      departure: null,
      balance: random.number(0, 2500),
      total_earnings: random.number(0, 2500),
    }))
  );

  await Promise.all(
    participants.participant.map((p: any) => initBadgeLevelProgress(p.pid))
  );

  const requiredTasks = await db.task.findMany({
    where: { type: TaskType.REQUIRED },
  });
  await assignTasksToParticipants(requiredTasks);
}

const main = async () => {
  const seed: any = await createSeedClient();
  const environment: string = process.env.NODE_ENV || "development";
  const isDevelopment: boolean = environment === "development";
  if (isDevelopment) {
    await seed.$resetDatabase();
    await initDb();
    await generateMockData(seed);
  } else {
    await initDb();
  }
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
