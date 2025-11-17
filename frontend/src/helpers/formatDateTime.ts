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
    day: "2-digit",
  });
}

// Converts UTC Date object to a string in the format "HH:mm" in local timezone
export function formatTimeInputValue(date: Date): string {
  return date.toLocaleTimeString("en-CA", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

// Converts strings in the format "YYYY-MM-DD" from local timezone to a Date object in UTC
export function parseDateInputValue(date: string): Date {
  const [year, month, day] = date.split("-");
  return new Date(Number(year), Number(month) - 1, Number(day));
}

// Converts strings in the format "HH:mm" from local timezone to a Date object in UTC
export function parseTimeInputValue(time: string): Date {
  const [hour, minute] = time.split(":");
  return new Date(0, 0, 0, Number(hour), Number(minute));
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

// Converts a UTC string date from a GraphQL response into the format "12:00 AM"
export function formatTimeString(date: string): string {
  const dateObj = new Date(date);
  return dateObj.toLocaleTimeString("en-CA", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
