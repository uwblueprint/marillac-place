import { BadgeType, Icon, RecurrenceFrequency, TaskType } from "@prisma/client";

export const systemBadges = [
  {
    name: "Log-in Badge",
    description: "Log-in for several days in a row",
    icon: Icon.FIVE_STAR,
    type: BadgeType.SYSTEM,
    is_consecutive: true,
    levels: [
      { level: 0, benchmark: 1, marillac_bucks: 2 },
      { level: 1, benchmark: 7, marillac_bucks: 5 },
      { level: 2, benchmark: 30, marillac_bucks: 10 },
      { level: 3, benchmark: 90, marillac_bucks: 20 },
      { level: 4, benchmark: 180, marillac_bucks: 40 },
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
      { level: 0, benchmark: 4, marillac_bucks: 2 },
      { level: 1, benchmark: 4, marillac_bucks: 5 },
      { level: 2, benchmark: 4, marillac_bucks: 10 },
      { level: 3, benchmark: 4, marillac_bucks: 20 },
      { level: 4, benchmark: 4, marillac_bucks: 40 },
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
    levels: [{ level: 0, benchmark: 1, marillac_bucks: 2 }],
  },
  {
    name: "Jack of All Trades Badge",
    description:
      "Total tried tasks - if they have chosen and completed 10 different types of tasks",
    icon: Icon.TOOL,
    type: BadgeType.SYSTEM,
    is_consecutive: false,
    levels: [{ level: 2, benchmark: 10, marillac_bucks: 10 }],
  },
];
