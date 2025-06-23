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

export const systemBadges = [
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

export const customBadges = [
  {
    name: "Housing Plan Badge",
    description:
      "Completed housing plan",
    icon: Icon.HOME,
    type: BadgeType.CUSTOM,
    is_consecutive: false,
  },
  {
    name: "Helping Hands Badge",
    description:
      "For someone who did a thoughtful deed or action to help support staff and/or another participant",
    icon: Icon.HEART,
    type: BadgeType.CUSTOM,
    is_consecutive: false,
  },
  {
    name: "Back on the Wagon Badge",
    description:
      "For someone who pulls together after a bad start to their week",
    icon: Icon.GROUP,
    type: BadgeType.CUSTOM,
    is_consecutive: false,
  },
  {
    name: "Above and Beyond Badge",
    description:
      "For someone who put in extra effort or time to achieve their goals and/or complete a task. Going beyond what is strictly required or expected.",
    icon: Icon.WINGS,
    type: BadgeType.CUSTOM,
    is_consecutive: false,
  },
];

export const participants = [
  {
    password: "test",
    room_number: 1,
    arrival_date: "2025-05-22T16:42:05",
    account_creation_date: "2025-05-22T16:42:05",
    marillac_bucks: 10,
  },
  {
    password: "marillac",
    room_number: 3,
    arrival_date: "2025-03-15T09:30:45",
    account_creation_date: "2025-03-15T09:30:45",
    marillac_bucks: 120,
  },
  {
    password: "hello123",
    room_number: 7,
    arrival_date: "2025-02-08T16:10:22",
    account_creation_date: "2025-02-08T16:10:22",
    marillac_bucks: 75,
  },
  {
    password: "jklkjlsjd",
    room_number: 5,
    arrival_date: "2025-06-01T11:05:17",
    account_creation_date: "2025-06-01T11:05:17",
    marillac_bucks: 200,
  },
  {
    password: "waterloo",
    room_number: 2,
    arrival_date: "2024-11-10T08:20:33",
    departure_date: "2025-05-15T14:10:45",
    account_creation_date: "2024-11-10T08:20:33",
    account_removal_date: "2025-05-15T14:10:45",
    marillac_bucks: 145,
  },
  {
    password: "comp_sci_1212",
    room_number: 5,
    arrival_date: "2024-10-05T10:45:00",
    departure_date: "2025-04-30T09:00:00",
    account_creation_date: "2024-10-05T10:45:00",
    account_removal_date: "2025-04-30T09:00:00",
    marillac_bucks: 88,
  },
  {
    password: "pwd456",
    room_number: 6,
    arrival_date: "2024-09-18T12:00:15",
    departure_date: "2025-03-20T18:30:50",
    account_creation_date: "2024-09-18T12:00:15",
    account_removal_date: "2025-03-20T18:30:50",
    marillac_bucks: 305,
  },
];



