// TODO (navraj):
// Identify all other string date formats used in the frontend
// For each format, implement a function that converts a Date object to the local timezone and formats it accordingly
// Additionally, for each React input type that accepts a date or time, implement a function that converts the input (usually React processes it as a formatted string) to a Date object
// If date / time does not matter, set the date or time to something standard (e.g. midnight, or January 1, 1970)

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
export function parseDateTimeInputValue(date: string, time: string = "00:00"): Date {
    const [yearStr, monthStr, dayStr] = date.split("-");
    const year = Number(yearStr);
    const month = Number(monthStr) - 1;
    const day = Number(dayStr);

    const [hourStr, minuteStr] = time.split(":");
    const hour = Number(hourStr);
    const minute = Number(minuteStr);
  
    return new Date(year, month, day, hour, minute);
}
