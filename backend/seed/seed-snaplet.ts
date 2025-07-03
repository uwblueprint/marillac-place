// @ts-nocheck
// Seed script for Marillac Place:
// Generates system badges and mock data for development/testing environments.

import { createSeedClient } from "@snaplet/seed";
import { PrismaClient } from "@prisma/client";
import {
  TaskType,
  TransactionType,
  BadgeType,
  RecurrenceFrequency,
  DayOfWeek,
  TimeOption,
  Priority,
  Status,
  Icon,
} from "@prisma/client";
import { systemBadges } from "./prodData";
import {
  participants,
  tasks,
  announcements,
  notes,
  assignedTasks,
  userAnnouncements,
  customBadges,
} from "./mockData";

async function seedProdData() {
  const prisma = new PrismaClient();
  try {
    for (const badge of systemBadges) {
      const existing = await prisma.badge.findUnique({
        where: { name: badge.name },
      });
      
      if (!existing) {
        await prisma.badge.create({
          data: {
            name: badge.name,
            description: badge.description,
            badge_type: badge.type,
            is_active: true,
            is_consecutive: badge.is_consecutive,
            icon: badge.icon,
            badge_level: {
              create: badge.levels,
            },
          },
        });
      }
    }
    console.log("✅ System badges seeded");
  } finally {
    await prisma.$disconnect();
  }
}

async function seedMockData(seed: any) {
  await seed.participant((createMany) => createMany(participants.length, (cur) => participants[cur.index]));
  console.log("✅ Participants seeded");
  
  await seed.task((createMany) => createMany(tasks.length, (cur) => tasks[cur.index]));
  console.log("✅ Tasks seeded");
  
  await seed.assignedTask((createMany) => createMany(assignedTasks.length, (cur) => assignedTasks[cur.index]));
  console.log("✅ Assigned tasks seeded");
  
  await seed.announcement((createMany) => createMany(announcements.length, (cur) => announcements[cur.index]));
  console.log("✅ Announcements seeded");
  
  await seed.userAnnouncement((createMany) => createMany(userAnnouncements.length, (cur) => userAnnouncements[cur.index]));
  console.log("✅ User announcements seeded");

  await seed.note((createMany) => createMany(notes.length, (cur) => notes[cur.index]));
  console.log("✅ Notes seeded");
  
  const prisma = new PrismaClient();
  try {
    for (const badge of customBadges) {
      await prisma.badge.create({
        data: {
          name: badge.name,
          description: badge.description,
          badge_type: badge.type,
          is_active: true,
          is_consecutive: badge.is_consecutive,
          icon: badge.icon,
        },
      });
    }
  } finally {
    console.log("✅ Custom badges seeded");
    await prisma.$disconnect();
  }
}

const main = async () => {
  const seed = await createSeedClient({
    connect: true,
  });

  const environment = process.env.NODE_ENV || "development";
  console.log(`🌍 Running in ${environment} environment`);
  
  if (environment === "development") {
    await seed.$resetDatabase();
    await seedProdData();
    await seedMockData(seed);
  } else {
    await seedProdData();
  }

  console.log("✨ Seeding completed successfully");
};

main().catch((e) => {
  console.error("⚠️ Error during seeding: ", e);
  process.exit(1);
});