import { DayOfWeek } from "../types/task";

export function formatDateTime(date: Date, includeTime: boolean): string {
  if (includeTime) {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/New_York",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  }

  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function getToday(): string {
  return formatDateTime(new Date(), false);
}

export function getNow(): string {
  return formatDateTime(new Date(), true);
}

// Helper to get Date object for today and previous days
export function getRecentDate(
  daysAgo: number,
  includeTime: boolean,
  time?: string
): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);

  if (includeTime) {
    if (time) {
      const [hours, minutes] = time.split(":").map(Number);
      date.setHours(hours, minutes, 0, 0);
    } else {
      date.setHours(0, 0, 0, 0);
    }
  }
  return formatDateTime(date, includeTime);
}

const fmt = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/New_York",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export function formatDateFromString(day: DayOfWeek, time?: string, is_end?: boolean): string {
  const dayMap: Record<DayOfWeek, number> = {
    MONDAY: 0,
    TUESDAY: 1,
    WEDNESDAY: 2,
    THURSDAY: 3,
    FRIDAY: 4,
    SATURDAY: 5,
    SUNDAY: 6,
  };

  const currentDate = new Date();
  const whichDay = currentDate.getDay();
  const diffToMonday = whichDay === 0 ? -6 : 1 - whichDay

  const targetDay = new Date();
  targetDay.setDate(currentDate.getDate() + diffToMonday + dayMap[day])

  if (time && time !== "") {
    const [hh, mm] = time.split(":");
    targetDay.setHours(Number(hh), Number(mm), 0, 0);
  } else if (!is_end) {
    targetDay.setHours(0, 0, 0, 0)
  } else {
    targetDay.setHours(23, 59, 59, 999)
  }

  return fmt.format(targetDay);
}

