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

export function getWeekBounds(): { weekStart: string; weekEnd: string } {
  const now = new Date();
  const day = now.getDay();

  // Start of week (Sunday)
  const sunday = new Date(now);
  sunday.setDate(now.getDate() - day);
  sunday.setHours(0, 0, 0, 0);
  const weekStart = formatDateTime(sunday, true);

  // End of week (Saturday)
  const saturday = new Date(sunday);
  saturday.setDate(sunday.getDate() + 6);
  saturday.setHours(23, 59, 0, 0);
  const weekEnd = formatDateTime(saturday, true);

  return { weekStart, weekEnd };
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

const dayMap: Record<DayOfWeek, number> = {
  MONDAY: 0,
  TUESDAY: 1,
  WEDNESDAY: 2,
  THURSDAY: 3,
  FRIDAY: 4,
  SATURDAY: 5,
  SUNDAY: 6,
};

export function formatDateFromString(day: DayOfWeek, time?: string, is_end?: boolean): string {
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

// takes in "YY-MM-DD, HH:mm" and convert to Date object
export function formatDateFromDateString(dateString: string) {
  const formatted = dateString.replace(", ", "T") + ":00";
  const date = new Date(formatted);
  return date
}

// format date string from string
// format date string from date
// format date from date string

export function isSameDay(day: DayOfWeek, date: Date) {
  const currentDate = new Date();
  const whichDay = currentDate.getDay();
  const diffToMonday = whichDay === 0 ? -6 : 1 - whichDay

  const targetDay = new Date();
  targetDay.setDate(currentDate.getDate() + diffToMonday + dayMap[day])

  return (
    date.getFullYear() === targetDay.getFullYear() &&
    date.getMonth() === targetDay.getMonth() &&
    date.getDate() === targetDay.getDate()
  );
}

export function convertToDaysListGivenRange(start: Date, end: Date): DayOfWeek[] {
  const map: Record<number, DayOfWeek> = {
    0: DayOfWeek.SUNDAY,
    1: DayOfWeek.MONDAY,
    2: DayOfWeek.TUESDAY,
    3: DayOfWeek.WEDNESDAY,
    4: DayOfWeek.THURSDAY,
    5: DayOfWeek.FRIDAY,
    6: DayOfWeek.SATURDAY,
  };

  const result: DayOfWeek[] = [];
  const current = new Date(start);

  while (current <= end) {
    result.push(map[current.getDay()]);
    current.setDate(current.getDate() + 1); 
  }

  return result;
}

export function isAnytime(start: Date, end: Date): boolean {
  return (
    start.getHours() === 0 &&
    start.getMinutes() === 0 &&
    end.getHours() === 23 &&
    end.getMinutes() === 59
  )
}

export function displayDate(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

export function formatTimeString(date: Date): string {
  const timeString = new Intl.DateTimeFormat('en-CA', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(date);
  return timeString;
}


export function getParticipantHomePageDateString() {
  const date = new Date();
  const parts = date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).split(",");

  const formattedDate = parts[0].replace(",", "") + " - " + parts[1].trim() + "," + parts[2];
  return formattedDate;
}

export function formatTimeRange(start: string, end: string): string {
  if (start.slice(-5) === "00:00" && end.slice(-5) === "23:59") {
    return "Anytime";
  }

  const timeFormatter = new Intl.DateTimeFormat("en-CA", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const startDate = new Date(start.replace(", ", "T"));
  const endDate = new Date(end.replace(", ", "T"));

  const formattedStart = timeFormatter.format(startDate).toLowerCase()
  const formattedEnd = timeFormatter.format(endDate).toLowerCase()

  return `${formattedStart} - ${formattedEnd}`;
}

export const displayDate2 = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "America/New_York",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    month: "short",
    day: "numeric",
  };

  const parts = new Intl.DateTimeFormat("en-CA", options).formatToParts(date);

  const get = (type: string) =>
    parts.find((p) => p.type === type)?.value || "";

  const hour = get("hour");
  const minute = get("minute");
  const month = get("month");
  const day = get("day");
  const dayPeriod = get("dayPeriod").toUpperCase().replaceAll(".", "");

  return `${hour}:${minute} ${dayPeriod}, ${month} ${day}`;
};