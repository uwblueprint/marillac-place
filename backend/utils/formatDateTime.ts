export function formatDateTime(date: Date, includeTime: boolean): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  if (includeTime) {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}, ${hours}:${minutes}`;
  }

  return `${year}-${month}-${day}`;
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

// takes in "YY-MM-DD, HH:mm" and convert to Date object
export function formatDateFromDateString(dateString: string) {
  const formatted = `${dateString.replace(", ", "T")}:00`;
  const date = new Date(formatted);
  return date;
}
