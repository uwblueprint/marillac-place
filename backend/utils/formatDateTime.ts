export function getToday(): string {
  return formatDateTime(new Date(), false);
}

export function getNow(): string {
  return formatDateTime(new Date(), true);
}

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