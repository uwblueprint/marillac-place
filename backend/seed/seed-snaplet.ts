// @ts-nocheck
// Seed script for Marillac Place:
// Generates system badges and mock data for development/testing environments.

import { createSeedClient } from "@snaplet/seed";
import {
  PrismaClient,
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
import { individual_goal, systemBadges } from "./prodData";
import {
  participants,
  tasks,
  announcements,
  notes,
  assignedTasks,
  userAnnouncements,
  customBadges,
} from "./mockData";
import { testParticipants } from "./testData";

async function seedProdData() {
  const prisma = new PrismaClient();
  try {
    // Check if there are any badges in the database
    const badgeCount = await prisma.badge.count();

    if (badgeCount === 0) {
      // No badges exist, seed all system badges
      for (const badge of systemBadges) {
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
      console.log("✅ System badges seeded");
    } else {
      console.log("✅ Badges already exist, skipping seeding");
    }
  } finally {
    await prisma.$disconnect();
  }
}

async function seedTestData(seed: any) {
  // Seed minimal test participants for production testing
  const prisma = new PrismaClient();
  try {
    for (const participant of testParticipants) {
      // Check if participant already exists
      const existing = await prisma.participant.findUnique({
        where: { participant_id: participant.participant_id },
      });

      if (!existing) {
        await prisma.participant.create({ data: participant });
        console.log(`✅ Test participant ${participant.participant_id} created`);
      } else {
        console.log(`ℹ️  Test participant ${participant.participant_id} already exists, skipping`);
      }
    }
  } catch (error) {
    console.error("⚠️ Error seeding test participants:", error);
  } finally {
    await prisma.$disconnect();
  }
}

async function seedMockData(seed: any) {
  await seed.participant((createMany) =>
    createMany(participants.length, (cur) => participants[cur.index])
  );
  console.log("✅ Participants seeded");

  await seed.task((createMany) =>
    createMany(tasks.length, (cur) => tasks[cur.index])
  );
  console.log("✅ Tasks seeded");

  await seed.assignedTask((createMany) =>
    createMany(assignedTasks.length, (cur) => assignedTasks[cur.index])
  );
  console.log("✅ Assigned tasks seeded");

  await seed.announcement((createMany) =>
    createMany(announcements.length, (cur) => announcements[cur.index])
  );
  console.log("✅ Announcements seeded");

  await seed.userAnnouncement((createMany) =>
    createMany(userAnnouncements.length, (cur) => userAnnouncements[cur.index])
  );
  console.log("✅ User announcements seeded");

  await seed.note((createMany) =>
    createMany(notes.length, (cur) => notes[cur.index])
  );
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
  const isProduction = environment === "production";
  const seedTestAccounts = process.env.SEED_TEST_DATA === "true";

  console.log(`🌍 Running in ${environment} environment`);

  if (isProduction) {
    // Production: only seed system badges, no database reset
    console.log("🔒 Production mode: seeding system badges only");
    await seedProdData();

    // Optionally seed test participants for production testing
    if (seedTestAccounts) {
      console.log("🧪 SEED_TEST_DATA enabled: seeding test participants");
      await seedTestData(seed);
    }
  } else {
    // Development: reset database and seed all data
    console.log("🔧 Development mode: resetting database and seeding all data");
    await seed.$resetDatabase();
    await seedProdData();
    await seedMockData(seed);
  }

  console.log("✨ Seeding completed successfully");
};

main().catch((e) => {
  console.error("⚠️ Error during seeding: ", e);
  process.exit(1);
});
