// TODO (navraj):
// Identify all other string date formats used in the frontend
// For each format, implement a function that converts a Date object to the local timezone and formats it accordingly
// Additionally, for each React input type that accepts a date or time, implement a function that converts the input (usually React processes it as a formatted string) to a Date object
// If date / time does not matter, set the date or time to something standard (e.g. midnight, or January 1, 1970)
// Try to see if we can use the date-fns library to help with this

// Converts UTC Date object to a string in the format "YYYY-MM-DD" in local timezone
export function formatDateInputValue(date: Date): string {
  return date.toLocaleDateString("en-CA", { 
    year: "numeric", 
    month: "2-digit", 
    day: "2-digit" 
  });
}

// Converts UTC Date object to a string in the format "HH:MM" in local timezone
export function formatTimeInputValue(date: Date): string {
  return date.toLocaleTimeString("en-CA", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Converts strings in the format "YYYY-MM-DD" and "HH:MM" from local timezone to a Date object in UTC
export function parseDateTimeInputValue(date: string, time = "00:00"): Date {
    const [yearStr, monthStr, dayStr] = date.split("-");
    const year = Number(yearStr);
    const month = Number(monthStr) - 1;
    const day = Number(dayStr);

    const [hourStr, minuteStr] = time.split(":");
    const hour = Number(hourStr);
    const minute = Number(minuteStr);
  
    return new Date(year, month, day, hour, minute);
}

// Converts today's date into the format "January 1, 2025" in the local timezone
export function getTodayDateString(): string {
  return new Date().toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Converts a UTC string date from a GraphQL response into the format "Jan 1, 12:00 AM"
export function formatDateTimeString(date: string): string {
  const dateObj = new Date(date);
  return dateObj.toLocaleString("en-CA", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    month: "short",
    day: "numeric",
  });
}
