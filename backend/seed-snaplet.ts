//@ts-nocheck

import { createSeedClient } from '@snaplet/seed';
import { faker } from '@faker-js/faker';
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
} from '@prisma/client';

const main = async () => {
  const seed = await createSeedClient({
    connect: true,
  });

  console.log('🌱 Starting Snaplet database seed...');

  // Reset database
  await seed.$resetDatabase();

  const numParticipants = 15;
  const numTasks = 15;
  const numAnnouncements = 50;

  // Seed participants
  await seed.participant((createMany) =>
    createMany(numParticipants, (ctx) => {
      const arrivalDate = faker.date.past({ years: 1 });
      const departureDate = faker.helpers.maybe(() => faker.date.future({ years: 1 }), { probability: 0.3 });
      
      return {
        participant_id: ctx.index + 1,
        password: faker.internet.password(),
        room_number: faker.number.int({ min: 1, max: 10 }),
        arrival_date: arrivalDate.toISOString().split('T')[0],
        departure_date: departureDate?.toISOString().split('T')[0] || null,
        account_creation_date: arrivalDate.toISOString().split('T')[0],
        account_removal_date: departureDate?.toISOString().split('T')[0] || null,
        marillac_bucks: faker.number.int({ min: 0, max: 500 }),
        marillac_bucks_goal: faker.helpers.maybe(() => faker.number.int({ min: 100, max: 1000 }), { probability: 0.7 }),
      };
    })
  );

  console.log(`👥 Created ${numParticipants} participants`);

  // Seed tasks
  const taskNames = [
    'Make Bed',
    'Clean Room',
    'Attend Therapy Session',
    'Complete Homework',
    'Participate in Group Activity',
    'Exercise',
    'Meditation',
    'Cooking Class',
    'Art Therapy',
    'Music Therapy',
    'Study Time',
    'Chores',
    'Community Service',
    'Self-Care Activity',
    'Goal Setting Session',
  ];

  await seed.task((createMany) =>
    createMany(numTasks, (ctx) => ({
      task_name: taskNames[ctx.index],
      task_type: faker.helpers.arrayElement(Object.values(TaskType)),
      recurrence_preference: faker.helpers.arrayElement(Object.values(RecurrenceFrequency)),
      repeat_days: faker.helpers.arrayElements(Object.values(DayOfWeek), { min: 1, max: 7 }),
      time_preference: faker.helpers.arrayElement(Object.values(TimeOption)),
      start_time: faker.helpers.maybe(() => faker.date.anytime().toTimeString().slice(0, 5), { probability: 0.6 }),
      end_time: faker.helpers.maybe(() => faker.date.anytime().toTimeString().slice(0, 5), { probability: 0.6 }),
      marillac_bucks_addition: faker.number.int({ min: 5, max: 50 }),
      marillac_bucks_deduction: faker.number.int({ min: 5, max: 30 }),
      comment: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.4 }),
    }))
  );

  console.log(`📋 Created ${numTasks} tasks`);

  // Seed assigned tasks
  await seed.assignedTask((createMany) =>
    createMany(50, () => {
      const startDate = faker.date.recent({ days: 30 });
      const endDate = faker.date.future({ days: 30, refDate: startDate });
      
      return {
        task_status: faker.helpers.arrayElement(Object.values(Status)),
        task_type: faker.helpers.arrayElement(Object.values(TaskType)),
        goal_name: faker.helpers.maybe(() => faker.lorem.words(3), { probability: 0.3 }),
        goal_description: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.3 }),
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        marillac_bucks_addition: faker.number.int({ min: 5, max: 50 }),
        marillac_bucks_deduction: faker.number.int({ min: 5, max: 30 }),
        comment: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.3 }),
      };
    })
  );

  console.log('✅ Created assigned tasks');

  // Seed announcements
  await seed.announcement((createMany) =>
    createMany(numAnnouncements, () => ({
      priority: faker.helpers.arrayElement(Object.values(Priority)),
      creation_date: faker.date.future({ days: 30 }).toISOString().split('T')[0],
      message: faker.lorem.paragraph(),
    }))
  );

  console.log(`📢 Created ${numAnnouncements} announcements`);

  // Seed transactions
  await seed.transaction((createMany) =>
    createMany(80, () => {
      const transactionType = faker.helpers.arrayElement(Object.values(TransactionType));
      let marillacBucks = 0;
      let description = '';

      switch (transactionType) {
        case TransactionType.EARNING:
          marillacBucks = faker.number.int({ min: 5, max: 50 });
          description = faker.helpers.arrayElement([
            'Task completion bonus',
            'Good behavior reward',
            'Weekly achievement',
            'Group participation',
            'Therapy attendance',
          ]);
          break;
        case TransactionType.PURCHASE:
          marillacBucks = -faker.number.int({ min: 10, max: 100 });
          description = faker.helpers.arrayElement([
            'Snack purchase',
            'Movie night ticket',
            'Special privilege',
            'Room decoration',
            'Music streaming',
          ]);
          break;
        case TransactionType.REFUND:
          marillacBucks = faker.number.int({ min: 5, max: 30 });
          description = faker.helpers.arrayElement([
            'Cancelled purchase refund',
            'Overpayment correction',
            'Service refund',
          ]);
          break;
      }

      return {
        transaction_date: faker.date.past({ days: 30 }).toISOString().split('T')[0],
        transaction_type: transactionType,
        description,
        marillac_bucks: marillacBucks,
      };
    })
  );

  console.log('💰 Created transactions');

  // Seed badges
  const badgeData = [
    {
      name: 'Log-in Badge',
      description: 'Log-in for several days in a row',
      icon: Icon.FIVE_STAR, 
      type: BadgeType.SYSTEM,
      is_consecutive: true,
      levels: [
        { level: 0, benchmark: 1, marillac_bucks: 2 }, // Beginner: First login
        { level: 1, benchmark: 7, marillac_bucks: 5 }, // Bronze: 7 days (1 week)
        { level: 2, benchmark: 30, marillac_bucks: 10 }, // Silver: 30 days (1 month)
        { level: 3, benchmark: 90, marillac_bucks: 20 }, // Gold: 90 days (3 months)
        { level: 4, benchmark: 180, marillac_bucks: 40 }, // Platinum: 180 days (6 months)
      ]
    },
    {
      name: 'Perfect Score Badge for Optional Tasks',
      description: 'Completed optional tasks (3+ Optional Tasks)',
      icon: Icon.FLOWER, // Plant/Flower
      type: BadgeType.SYSTEM,
      is_consecutive: false,
      levels: [
        { level: 0, benchmark: 1, marillac_bucks: 2 }, // Beginner: 1st time completed
        { level: 1, benchmark: 4, marillac_bucks: 5 }, // Bronze: 4 weeks
        { level: 2, benchmark: 8, marillac_bucks: 10 }, // Silver: 8 weeks
        { level: 3, benchmark: 12, marillac_bucks: 20 }, // Gold: 12 weeks
        { level: 4, benchmark: 16, marillac_bucks: 40 }, // Platinum: 16 weeks
      ]
    },
    {
      name: 'Perfect Score Badge for Mandatory Tasks',
      description: 'Completed mandatory tasks (Weekly Review, Skills, Housing Plan)',
      icon: Icon.PENCIL, // Pencil
      type: BadgeType.SYSTEM,
      is_consecutive: false,
      levels: [
        { level: 0, benchmark: 1, marillac_bucks: 2 }, // Beginner: 1st time completed
        { level: 1, benchmark: 4, marillac_bucks: 5 }, // Bronze: 4 weeks
        { level: 2, benchmark: 8, marillac_bucks: 10 }, // Silver: 8 weeks
        { level: 3, benchmark: 12, marillac_bucks: 20 }, // Gold: 12 weeks
        { level: 4, benchmark: 16, marillac_bucks: 40 }, // Platinum: 16 weeks
      ]
    },
    {
      name: 'Money Earned Milestone Badge',
      description: 'Total money earned milestone',
      icon: Icon.MONEY, // Dollar Sign
      type: BadgeType.SYSTEM,
      is_consecutive: false,
      levels: [
        { level: 0, benchmark: 100, marillac_bucks: 2 }, // Beginner: $100
        { level: 1, benchmark: 500, marillac_bucks: 5 }, // Bronze: $500
        { level: 2, benchmark: 1000, marillac_bucks: 10 }, // Silver: $1,000
        { level: 3, benchmark: 4000, marillac_bucks: 20 }, // Gold: $4,000
        { level: 4, benchmark: 8000, marillac_bucks: 40 }, // Platinum: $8,000
      ]
    },
    {
      name: 'PR Leader Badge',
      description: 'Accumulation of other badges',
      icon: Icon.DIAMOND, // Diamond
      type: BadgeType.SYSTEM,
      is_consecutive: false,
      levels: [
        { level: 0, benchmark: 4, marillac_bucks: 2 }, // Beginner: 4 beginner badges
        { level: 1, benchmark: 4, marillac_bucks: 5 }, // Bronze: 4 bronze badges
        { level: 2, benchmark: 4, marillac_bucks: 10 }, // Silver: 4 silver badges
        { level: 3, benchmark: 4, marillac_bucks: 20 }, // Gold: 4 gold badges
        { level: 4, benchmark: 4, marillac_bucks: 40 }, // Platinum: 4 platinum badges
      ]
    },
    {
      name: 'Individual Goals Completed Badge',
      description: 'Individual goal(s) set and completed',
      icon: Icon.GEMSTONE, 
      type: BadgeType.SYSTEM,
      is_consecutive: false,
      levels: [
        { level: 0, benchmark: 1, marillac_bucks: 2 }, // Beginner: 1st time completed
        { level: 1, benchmark: 4, marillac_bucks: 5 }, // Bronze: 4 weeks
        { level: 2, benchmark: 8, marillac_bucks: 10 }, // Silver: 8 weeks
        { level: 3, benchmark: 12, marillac_bucks: 20 }, // Gold: 12 weeks
        { level: 4, benchmark: 16, marillac_bucks: 40 }, // Platinum: 16 weeks
      ]
    },
    {
      name: 'Housing Focused Badge',
      description: 'Housing Plan completed',
      icon: Icon.HOME, // House
      type: BadgeType.CUSTOM, // Granted manually
      is_consecutive: false,
      levels: [
        { level: 0, benchmark: 1, marillac_bucks: 2 }, // Beginner: 1st time they complete HP
        { level: 1, benchmark: 1, marillac_bucks: 5 }, // Bronze
        { level: 2, benchmark: 1, marillac_bucks: 10 }, // Silver
        { level: 3, benchmark: 1, marillac_bucks: 20 }, // Gold
        { level: 4, benchmark: 1, marillac_bucks: 40 }, // Platinum: Housing Secured
      ]
    },
    {
      name: 'First Goal Set Badge',
      description: 'Set first goal',
      icon: Icon.FOUR_STAR, // Star
      type: BadgeType.SYSTEM,
      is_consecutive: false,
      levels: [
        { level: 0, benchmark: 1, marillac_bucks: 2 }, // Beginner
      ]
    },
    {
      name: 'Jack of All Trades Badge',
      description: 'Total tried tasks - if they have chosen and completed 10 different types of tasks',
      icon: Icon.TOOL, // Tools
      type: BadgeType.SYSTEM,
      is_consecutive: false,
      levels: [
        { level: 2, benchmark: 10, marillac_bucks: 10 }, // Silver
      ]
    },
    {
      name: 'Back on the Wagon Badge',
      description: 'For someone who pulls together after a bad start to their week',
      icon: Icon.FOUR_STAR, // Wagon -> closest match
      type: BadgeType.CUSTOM, // Granted manually
      is_consecutive: false,
      levels: [
        { level: 1, benchmark: 1, marillac_bucks: 5 }, // Bronze
      ]
    },
    {
      name: 'Helping Hand Badge',
      description: 'For someone who did a thoughtful deed or action to help support staff and/or another participant',
      icon: Icon.HEART, // Heart
      type: BadgeType.CUSTOM, // Granted manually
      is_consecutive: false,
      levels: [
        { level: 0, benchmark: 1, marillac_bucks: 2 }, // Beginner
        { level: 1, benchmark: 1, marillac_bucks: 5 }, // Bronze
        { level: 2, benchmark: 1, marillac_bucks: 10 }, // Silver
        { level: 3, benchmark: 1, marillac_bucks: 20 }, // Gold
        { level: 4, benchmark: 1, marillac_bucks: 40 }, // Platinum
      ]
    },
    {
      name: 'Above and Beyond Badge',
      description: 'For someone who put in extra effort or time to achieve their goals and/or complete a task. Going beyond what is strictly required or expected.',
      icon: Icon.WINGS, // Wings
      type: BadgeType.CUSTOM, // Granted manually
      is_consecutive: false,
      levels: [
        { level: 0, benchmark: 1, marillac_bucks: 2 }, // Beginner
        { level: 1, benchmark: 1, marillac_bucks: 5 }, // Bronze
        { level: 2, benchmark: 1, marillac_bucks: 10 }, // Silver
        { level: 3, benchmark: 1, marillac_bucks: 20 }, // Gold
        { level: 4, benchmark: 1, marillac_bucks: 40 }, // Platinum
      ]
    }
  ];

  // Create badges
  const createdBadges = [];
  for (let i = 0; i < badgeData.length; i++) {
    const badge = badgeData[i];
    const createdBadge = await seed.badge([{
      badge_type: badge.type,
      name: badge.name,
      description: badge.description,
      is_active: true,
      is_consecutive: badge.is_consecutive,
      icon: badge.icon,
    }]);
    createdBadges.push({ ...createdBadge[0], levels: badge.levels });
  }

  console.log(`🏆 Created ${badgeData.length} badges`);

  // Create badge levels
  for (const badge of createdBadges) {
    for (const level of badge.levels) {
      await seed.badgeLevel([{
        badge_id: badge.badge_id,
        level: level.level,
        benchmark: level.benchmark,
        marillac_bucks: level.marillac_bucks,
      }]);
    }
  }

  console.log('🎖️ Created badge levels');

  // Seed notes
  await seed.note((createMany) =>
    createMany(20, () => ({
      message: faker.lorem.paragraph(),
      creation_date: faker.date.past({ days: 30 }).toISOString().split('T')[0],
    }))
  );

  console.log('📝 Created notes');

  console.log('🎉 Snaplet database seeded successfully!');

  process.exit(0);
};

main().catch((error) => {
  console.error('❌ Error seeding database:', error);
  process.exit(1);
}); 