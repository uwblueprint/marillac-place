import { DayOfWeek } from "../types/enums";

export const DAYS = [
  DayOfWeek.SUNDAY,
  DayOfWeek.MONDAY,
  DayOfWeek.TUESDAY,
  DayOfWeek.WEDNESDAY,
  DayOfWeek.THURSDAY,
  DayOfWeek.FRIDAY,
  DayOfWeek.SATURDAY,
];

export const DAY_ABBREVIATIONS = {
  [DayOfWeek.SUNDAY]: "Su",
  [DayOfWeek.MONDAY]: "M",
  [DayOfWeek.TUESDAY]: "T",
  [DayOfWeek.WEDNESDAY]: "W",
  [DayOfWeek.THURSDAY]: "Th",
  [DayOfWeek.FRIDAY]: "F",
  [DayOfWeek.SATURDAY]: "S",
};
