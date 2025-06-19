//@ts-nocheck

// Seed script for Marillac Place: generates system badges and mock data for development/testing environments.

import { createSeedClient } from "@snaplet/seed";
import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
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

// System badges to be present in all environments, with their levels and requirements
const systemBadges = [
  {
    name: "Log-in Badge",
    description: "Log-in for several days in a row",
    icon: Icon.FIVE_STAR,
    type: BadgeType.SYSTEM,
    is_consecutive: true,
    levels: [
      { level: 0, benchmark: 1, marillac_bucks: 2 }, // First login
      { level: 1, benchmark: 7, marillac_bucks: 5 }, // 7 days (1 week)
      { level: 2, benchmark: 30, marillac_bucks: 10 }, // 30 days (1 month)
      { level: 3, benchmark: 90, marillac_bucks: 20 }, // 90 days (3 months)
      { level: 4, benchmark: 180, marillac_bucks: 40 }, // 180 days (6 months)
    ],
  },
  {
    name: "Perfect Score Badge for Optional Tasks",
    description: "Completed optional tasks (3+ Optional Tasks)",
    icon: Icon.FLOWER,
    type: BadgeType.SYSTEM,
    is_consecutive: false,
    levels: [
      { level: 0, benchmark: 1, marillac_bucks: 2 },
      { level: 1, benchmark: 4, marillac_bucks: 5 },
      { level: 2, benchmark: 8, marillac_bucks: 10 },
      { level: 3, benchmark: 12, marillac_bucks: 20 },
      { level: 4, benchmark: 16, marillac_bucks: 40 },
    ],
  },
  {
    name: "Perfect Score Badge for Mandatory Tasks",
    description:
      "Completed mandatory tasks (Weekly Review, Skills, Housing Plan)",
    icon: Icon.PENCIL,
    type: BadgeType.SYSTEM,
    is_consecutive: false,
    levels: [
      { level: 0, benchmark: 1, marillac_bucks: 2 },
      { level: 1, benchmark: 4, marillac_bucks: 5 },
      { level: 2, benchmark: 8, marillac_bucks: 10 },
      { level: 3, benchmark: 12, marillac_bucks: 20 },
      { level: 4, benchmark: 16, marillac_bucks: 40 },
    ],
  },
  {
    name: "Money Earned Milestone Badge",
    description: "Total money earned milestone",
    icon: Icon.MONEY,
    type: BadgeType.SYSTEM,
    is_consecutive: false,
    levels: [
      { level: 0, benchmark: 100, marillac_bucks: 2 },
      { level: 1, benchmark: 500, marillac_bucks: 5 },
      { level: 2, benchmark: 1000, marillac_bucks: 10 },
      { level: 3, benchmark: 4000, marillac_bucks: 20 },
      { level: 4, benchmark: 8000, marillac_bucks: 40 },
    ],
  },
  {
    name: "PR Leader Badge",
    description: "Accumulation of other badges",
    icon: Icon.DIAMOND,
    type: BadgeType.SYSTEM,
    is_consecutive: false,
    levels: [
      { level: 0, benchmark: 4, marillac_bucks: 2 }, // 4 beginner badges
      { level: 1, benchmark: 4, marillac_bucks: 5 }, // 4 bronze badges
      { level: 2, benchmark: 4, marillac_bucks: 10 }, // 4 silver badges
      { level: 3, benchmark: 4, marillac_bucks: 20 }, // 4 gold badges
      { level: 4, benchmark: 4, marillac_bucks: 40 }, // 4 platinum badges
    ],
  },
  {
    name: "Individual Goals Completed Badge",
    description: "Individual goal(s) set and completed",
    icon: Icon.GEMSTONE,
    type: BadgeType.SYSTEM,
    is_consecutive: false,
    levels: [
      { level: 0, benchmark: 1, marillac_bucks: 2 },
      { level: 1, benchmark: 4, marillac_bucks: 5 },
      { level: 2, benchmark: 8, marillac_bucks: 10 },
      { level: 3, benchmark: 12, marillac_bucks: 20 },
      { level: 4, benchmark: 16, marillac_bucks: 40 },
    ],
  },
  {
    name: "First Goal Set Badge",
    description: "Set first goal",
    icon: Icon.FOUR_STAR, // Only one level for first goal
    type: BadgeType.SYSTEM,
    is_consecutive: false,
    levels: [
      { level: 0, benchmark: 1, marillac_bucks: 2 },
    ],
  },
  {
    name: "Jack of All Trades Badge",
    description:
      "Total tried tasks - if they have chosen and completed 10 different types of tasks",
    icon: Icon.TOOL,
    type: BadgeType.SYSTEM,
    is_consecutive: false,
    levels: [
      { level: 2, benchmark: 10, marillac_bucks: 10 },
    ],
  },
];

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

// Main mock data seeding function for development
async function seedMockData(seed: any) {
  console.log("🌱 Starting mock data seeding...");

  // --- Participants ---
  // Generate a mix of current and past participants
  const numParticipants = 10;
  const participantsData = Array.from({ length: numParticipants }, (_, i) => {
    const arrivalDate = faker.date.past({ years: 1 });
    const isCurrent = i < 5;
    const departureDate = isCurrent ? null : faker.date.between({ from: arrivalDate, to: new Date() });
    return {
      password: faker.internet.password(),
      room_number: faker.number.int({ min: 1, max: 10 }),
      arrival_date: toNoonUTCISOString(arrivalDate),
      departure_date: departureDate ? toNoonUTCISOString(departureDate) : null,
      account_creation_date: toNoonUTCISOString(arrivalDate),
      account_removal_date: departureDate ? toNoonUTCISOString(departureDate) : null,
      marillac_bucks: faker.number.int({ min: 0, max: 500 }),
      marillac_bucks_goal: faker.helpers.maybe(
        () => faker.number.int({ min: 100, max: 1000 }),
        { probability: 0.7 }
      ),
    };
  });
  await seed.participant((createMany) => createMany(numParticipants, (cur) => participantsData[cur.index]));
  console.log(`👥 Created ${participantsData.length} participants`);

  // --- Tasks ---
  // Generate required and optional tasks with various recurrence and time preferences
  const requiredTasks = [
    "Weekly Review",
    "Skills Assessment",
    "Housing Plan Update",
    "Therapy Session",
    "Case Management Meeting",
  ];
  const optionalTasks = [
    "Art Therapy",
    "Exercise Class",
    "Cooking Workshop",
    "Meditation Session",
    "Peer Support Group",
  ];
  const numRequiredTasks = requiredTasks.length;
  const numOptionalTasks = optionalTasks.length;

  const requiredTasksData = Array.from({ length: numRequiredTasks }, (_, i) => {
    const recurrencePreference = faker.helpers.arrayElement(Object.values(RecurrenceFrequency));
    const timePreference = faker.helpers.arrayElement(Object.values(TimeOption));
    let repeatDays;
    switch (recurrencePreference) {
      case RecurrenceFrequency.DAILY:
        repeatDays = Object.values(DayOfWeek);
        break;
      case RecurrenceFrequency.WEEKLY:
        repeatDays = [faker.helpers.arrayElement(Object.values(DayOfWeek))];
        break;
      case RecurrenceFrequency.BIWEEKLY:
        repeatDays = faker.helpers.arrayElements(Object.values(DayOfWeek), { min: 1, max: 2 });
        break;
      case RecurrenceFrequency.MONTHLY:
        repeatDays = [faker.helpers.arrayElement(Object.values(DayOfWeek))];
        break;
      default:
        repeatDays = faker.helpers.arrayElements(Object.values(DayOfWeek), { min: 1, max: 3 });
    }
    let startTime = null;
    let endTime = null;
    if (timePreference === TimeOption.SPECIFIC) {
      const start = faker.date.anytime();
      startTime = start.toTimeString().slice(0, 5);
      const end = new Date(start.getTime() + 60 * 60 * 1000);
      endTime = end.toTimeString().slice(0, 5);
    }
    return {
      task_name: requiredTasks[i],
      task_type: TaskType.REQUIRED,
      recurrence_preference: recurrencePreference,
      repeat_days: repeatDays,
      time_preference: timePreference,
      start_time: startTime,
      end_time: endTime,
      marillac_bucks_addition: faker.number.int({ min: 10, max: 50 }),
      marillac_bucks_deduction: faker.number.int({ min: 0, max: 30 }),
      comment: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.4 }),
    };
  });
  const optionalTasksData = Array.from({ length: numOptionalTasks }, (_, i) => {
    const recurrencePreference = faker.helpers.arrayElement(Object.values(RecurrenceFrequency));
    const timePreference = faker.helpers.arrayElement(Object.values(TimeOption));
    let repeatDays;
    switch (recurrencePreference) {
      case RecurrenceFrequency.DAILY:
        repeatDays = Object.values(DayOfWeek);
        break;
      case RecurrenceFrequency.WEEKLY:
        repeatDays = [faker.helpers.arrayElement(Object.values(DayOfWeek))];
        break;
      case RecurrenceFrequency.BIWEEKLY:
        repeatDays = faker.helpers.arrayElements(Object.values(DayOfWeek), { min: 1, max: 2 });
        break;
      case RecurrenceFrequency.MONTHLY:
        repeatDays = [faker.helpers.arrayElement(Object.values(DayOfWeek))];
        break;
      default:
        repeatDays = faker.helpers.arrayElements(Object.values(DayOfWeek), { min: 1, max: 3 });
    }
    let startTime = null;
    let endTime = null;
    if (timePreference === TimeOption.SPECIFIC) {
      const start = faker.date.anytime();
      startTime = start.toTimeString().slice(0, 5);
      const end = new Date(start.getTime() + 60 * 60 * 1000);
      endTime = end.toTimeString().slice(0, 5);
    }
    return {
      task_name: optionalTasks[i],
      task_type: TaskType.OPTIONAL,
      recurrence_preference: recurrencePreference,
      repeat_days: repeatDays,
      time_preference: timePreference,
      start_time: startTime,
      end_time: endTime,
      marillac_bucks_addition: faker.number.int({ min: 5, max: 30 }),
      marillac_bucks_deduction: faker.number.int({ min: 0, max: 20 }),
      comment: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.4 }),
    };
  });
  const tasksData = [...requiredTasksData, ...optionalTasksData];
  await seed.task((createMany) => createMany(tasksData.length, (cur) => tasksData[cur.index]));
  console.log(`📋 Created ${tasksData.length} tasks`);

  // --- Announcements ---
  // Each announcement will have at least one user announcement associated
  const numAnnouncements = 10;
  const announcementsData = Array.from({ length: numAnnouncements }, () => {
    const daysAgo = faker.number.int({ min: 0, max: 2 });
    const creationDate = new Date();
    creationDate.setDate(creationDate.getDate() - daysAgo);
    return {
      priority: faker.helpers.arrayElement(Object.values(Priority)),
      creation_date: toNoonUTCISOString(creationDate),
      message: faker.lorem.paragraph(),
    };
  });
  await seed.announcement((createMany) => createMany(numAnnouncements, (cur) => announcementsData[cur.index]));
  console.log(`📢 Created ${announcementsData.length} announcements from today or past 2 days`);

  // Ensure every announcement has at least one user announcement
  const minUserAnnouncements = announcementsData.map((announcement, i) => {
    return {
      announcement_id: announcement.announcement_id ?? i + 1, // fallback if announcement_id is undefined
      participant_id: faker.helpers.arrayElement(participantsData).participant_id,
      is_read: false,
      read_date: null,
    };
  });

  // --- Notes ---
  // Notes are attached to random participants and dated within the last 3 days
  const numNotes = 10;
  const notesData = Array.from({ length: numNotes }, () => {
    const daysAgo = faker.number.int({ min: 0, max: 2 });
    const creationDate = new Date();
    creationDate.setDate(creationDate.getDate() - daysAgo);
    return {
      participant_id: faker.helpers.arrayElement(participantsData).participant_id,
      message: faker.lorem.paragraph(),
      creation_date: toNoonUTCISOString(creationDate),
    };
  });
  await seed.note((createMany) => createMany(numNotes, (cur) => notesData[cur.index]));
  console.log("📝 Created 10 notes from today or past 2 days");

  // --- Assigned Tasks ---
  // Assign tasks to participants, including individual goals
  const numAssignedTasks = 20;
  const assignedTasksData = Array.from({ length: numAssignedTasks }, () => {
    const startDate = faker.date.recent({ days: 30 });
    const endDate = faker.date.future({ days: 30, refDate: startDate });
    const taskType = faker.helpers.arrayElement(Object.values(TaskType));
    let goalName = null;
    let goalDescription = null;
    if (taskType === TaskType.INDIVIDUAL_GOAL) {
      goalName = faker.lorem.words(3);
      goalDescription = faker.lorem.sentence();
    }
    return {
      participant_id: faker.helpers.arrayElement(participantsData).participant_id,
      task_name: faker.helpers.arrayElement(tasksData).task_name,
      task_status: faker.helpers.arrayElement(Object.values(Status)),
      task_type: taskType,
      goal_name: goalName,
      goal_description: goalDescription,
      start_date: toNoonUTCISOString(startDate),
      end_date: toNoonUTCISOString(endDate),
      marillac_bucks_addition: faker.number.int({ min: 5, max: 50 }),
      marillac_bucks_deduction: faker.number.int({ min: 0, max: 30 }),
      comment: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.3 }),
    };
  });
  await seed.assignedTask((createMany) => createMany(numAssignedTasks, (cur) => assignedTasksData[cur.index]));
  console.log("✅ Created assigned tasks");

  // --- User Announcements ---
  // Additional random user announcements, in addition to the guaranteed one per announcement
  const numUserAnnouncements = 15;
  const userAnnouncementsData = Array.from({ length: numUserAnnouncements }, () => {
    let readDate = null;
    if (faker.datatype.boolean({ probability: 0.6 })) {
      const daysAgo = faker.number.int({ min: 0, max: 2 });
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      readDate = toNoonUTCISOString(date);
    }
    return {
      announcement_id: faker.helpers.arrayElement(announcementsData).announcement_id,
      participant_id: faker.helpers.arrayElement(participantsData).participant_id,
      is_read: readDate !== null,
      read_date: readDate,
    };
  });
  // Combine guaranteed and random user announcements
  const allUserAnnouncements = [...minUserAnnouncements, ...userAnnouncementsData];
  await seed.userAnnouncement((createMany) => createMany(allUserAnnouncements.length, (cur) => allUserAnnouncements[cur.index]));
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

  // Only seed mock data in development
  if (environment === "development") {
    console.log(`✅ Environment is development, seeding mock data...`);
    await seedMockData(seed);
  } else {
    console.log(`❌ Environment is ${environment}, skipping mock data seeding`);
  }

  console.log("✨ Seeding completed successfully");
};

main().catch((e) => {
  console.error("Error during seeding:", e);
  process.exit(1);
});
