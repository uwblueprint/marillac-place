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
