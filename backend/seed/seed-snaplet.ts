//@ts-nocheck

// Seed script for Marillac Place: generates system badges and mock data for development/testing environments.

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
import { systemBadges } from "./systemBadgeData";
import {
  participants,
  tasks,
  announcements,
  notes,
  assignedTasks,
  userAnnouncements,
  customBadges,
} from "./mockData";

// Helper: returns an ISO string for noon UTC on the given date
// (for consistent date seeding, it will show up as the same date in North America)
function toNoonUTCISOString(date: Date): string {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 12, 0, 0, 0)).toISOString();
}

// Seed system badges if not already present
async function seedSystemBadges() {
  console.log("🏆 Seeding system badges...");
  const prisma = new PrismaClient();
  try {
    // Avoid duplicates by checking for existing badges with the same name
    for (const badge of systemBadges) {
      const existingBadge = await prisma.badge.findFirst({
        where: { name: badge.name },
      });
      if (!existingBadge) {
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

// Seed custom badges if not already present
async function seedCustomBadges() {
  console.log("🏅 Seeding custom badges...");
  const prisma = new PrismaClient();
  try {
    for (const badge of customBadges) {
      const existingBadge = await prisma.badge.findFirst({
        where: { name: badge.name },
      });
      if (!existingBadge) {
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
    }
    console.log("✅ Custom badges seeded");
  } finally {
    await prisma.$disconnect();
  }
}

// Main mock data seeding function for development
async function seedMockData(seed: any) {
  console.log("🌱 Starting mock data seeding...");

  // --- Participants ---
  await seed.participant((createMany) => createMany(participants.length, (cur) => participants[cur.index]));
  console.log(`👥 Created ${participants.length} participants`);

  // --- Tasks ---
  await seed.task((createMany) => createMany(tasks.length, (cur) => tasks[cur.index]));
  console.log(`📋 Created ${tasks.length} tasks`);

  // --- Announcements ---
  await seed.announcement((createMany) => createMany(announcements.length, (cur) => announcements[cur.index]));
  console.log(`📢 Created ${announcements.length} announcements`);

  // --- Notes ---
  await seed.note((createMany) => createMany(notes.length, (cur) => notes[cur.index]));
  console.log(`📝 Created ${notes.length} notes`);

  // --- Assigned Tasks ---
  await seed.assignedTask((createMany) => createMany(assignedTasks.length, (cur) => assignedTasks[cur.index]));
  console.log("✅ Created assigned tasks");

  // --- User Announcements ---
  await seed.userAnnouncement((createMany) => createMany(userAnnouncements.length, (cur) => userAnnouncements[cur.index]));
  console.log("📬 Created UserAnnouncements with valid IDs");

  console.log("🎉 Mock data seeded successfully!");
}

const main = async () => {
  const seed = await createSeedClient({
    connect: true,
  });

  const environment = process.env.NODE_ENV || "development";
  console.log(`🌍 Running in ${environment} environment`);
  console.log(`🔍 NODE_ENV value: "${process.env.NODE_ENV}"`);
  console.log(`🔍 Environment check: ${environment === "development"}`);

  // Reset database for a clean slate
  await seed.$resetDatabase();

  // Always seed system badges (required for all environments)
  await seedSystemBadges();

  // Only seed mock data and custom badges in development
  if (environment === "development") {
    console.log(`✅ Environment is development, seeding mock data...`);
    await seedMockData(seed);
    await seedCustomBadges();
  } else {
    console.log(`❌ Environment is ${environment}, skipping mock data seeding`);
  }

  console.log("✨ Seeding completed successfully");
};

main().catch((e) => {
  console.error("Error during seeding:", e);
  process.exit(1);
});