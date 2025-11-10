import { createSeedClient, SeedClient } from "@snaplet/seed";
import { PrismaClient, TaskType } from "@prisma/client";
import { badgeLevels, systemBadges, tasks } from "./initialData";
import db from "../prisma";
import * as random from "./random";

async function initDb() {
  const systemBadgeCount = await db.systemBadge.count();
  const initialized = systemBadgeCount !== 0;
  if (!initialized) {
    await Promise.all(
      systemBadges.map(async (systemBadge) => {
        return db.systemBadge.create({
          data: systemBadge
        });
      })
    );

    await Promise.all(
      badgeLevels.map(async (badgeLevel) => {
        return db.badgeLevel.create({
          data: badgeLevel
        });
      })
    );

    await Promise.all(
      tasks.map(async (task) => {
        return db.task.create({
          data: task
        });
      })
    );
  }
}

async function generateMockData(seed: SeedClient) {
  const participants = await seed.participant((createMany) => createMany(10, (ret) => ({
    pid: ret.index + 1,
    password: random.password(), 
    room: ret.index + 1,
    arrival: random.date(),
    balance: random.number(0, 2500),
  })))
};

const main = async () => {
  const seed: SeedClient = await createSeedClient({ connect: true });

  const environment: string = process.env.NODE_ENV || "development";
  const isDevelopment: boolean = environment === "development";

  if (isDevelopment) {
    await seed.$resetDatabase();
    await generateMockData(seed);
  }

  await initDb();
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
