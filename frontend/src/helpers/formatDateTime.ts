import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export const now = () => toZonedTime(new Date(), "America/New_York");

// ============================================================================
// UTC Date Object to Local Timezone Strings
// ============================================================================

/**
 * Converts a Date object to a string in the format "YYYY-MM-DD" for use with <input type="date">.
 * The date is formatted in the local timezone.
 *
 * @param date - The Date object to format
 * @returns A string in "YYYY-MM-DD" format (e.g., "2025-01-15")
 * @example
 * ```ts
 * const date = new Date(2025, 0, 15);
 * const formatted = formatDateInputValue(date); // "2025-01-15"
 * ```
 */
export function formatDateInputValue(date: Date): string {
  return date.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

/**
 * Converts a Date object to a string in the format "HH:mm" for use with <input type="time">.
 * The time is formatted in the local timezone using 24-hour format.
 *
 * @param date - The Date object to format
 * @returns A string in "HH:mm" format (e.g., "14:30")
 * @example
 * ```ts
 * const date = new Date(2025, 0, 15, 14, 30);
 * const formatted = formatTimeInputValue(date); // "14:30"
 * ```
 */
export function formatTimeInputValue(date: Date): string {
  return date.toLocaleTimeString("en-CA", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

/**
 * Converts today's date into a human-readable format "January 1, 2025" in the local timezone.
 *
 * @returns A string representing today's date (e.g., "January 15, 2025")
 * @example
 * ```ts
 * const today = getTodayDateString(); // "January 15, 2025"
 * ```
 */
export function getTodayDateString(): string {
  return new Date().toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Converts a UTC string date (typically from a GraphQL response) into a formatted string
 * with date and time: "Jan 1, 12:00 AM" in the local timezone.
 *
 * @param date - A UTC date string (ISO format) or Date object
 * @returns A formatted string (e.g., "Jan 15, 2:30 PM")
 * @example
 * ```ts
 * const utcString = "2025-01-15T14:30:00Z";
 * const formatted = formatDateTimeString(utcString); // "Jan 15, 2:30 PM" (in local timezone)
 * ```
 */
export function formatDateTimeString(date: string): string {
  const dateObj = new Date(date);
  const formatted = dateObj.toLocaleString("en-CA", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    month: "short",
    day: "numeric",
  });
  return formatted.replace("a.m.", "AM").replace("p.m.", "PM");
}

/**
 * Converts a UTC string date (typically from a GraphQL response) into a formatted time string
 * "12:00 AM" in the local timezone.
 *
 * @param date - A UTC date string (ISO format) or Date object
 * @returns A formatted time string (e.g., "2:30 PM")
 * @example
 * ```ts
 * const utcString = "2025-01-15T14:30:00Z";
 * const formatted = formatTimeString(utcString); // "2:30 PM" (in local timezone)
 * ```
 */
export function formatTimeString(date: string): string {
  const dateObj = new Date(date);
  return dateObj.toLocaleTimeString("en-CA", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Converts a Date object to a day abbreviation in uppercase format (e.g., "MON", "TUE", "WED").
 * Uses date-fns for consistent formatting.
 *
 * @param date - The Date object to format
 * @returns A string representing the day abbreviation in uppercase (e.g., "MON")
 * @example
 * ```ts
 * const date = new Date(2025, 0, 15); // Wednesday
 * const dayAbbr = formatDayAbbreviation(date); // "WED"
 * ```
 */
export function formatDayAbbreviation(date: Date): string {
  return format(date, "EEE").toUpperCase();
}

/**
 * Converts a Date object to just the day number (1-31) as a string.
 * Uses date-fns for consistent formatting.
 *
 * @param date - The Date object to format
 * @returns A string representing the day number (e.g., "15")
 * @example
 * ```ts
 * const date = new Date(2025, 0, 15);
 * const dayNumber = formatDayNumber(date); // "15"
 * ```
 */
export function formatDayNumber(date: Date): string {
  return format(date, "d");
}

/**
 * Converts a Date object to the format "MONDAY 1" (full day name + day number) in uppercase.
 * Uses date-fns for consistent formatting.
 *
 * @param date - The Date object to format
 * @returns A string in the format "MONDAY 1" (e.g., "WEDNESDAY 15")
 * @example
 * ```ts
 * const date = new Date(2025, 0, 15); // Wednesday
 * const formatted = formatDayNameAndNumber(date); // "WEDNESDAY 15"
 * ```
 */
export function formatDayNameAndNumber(date: Date): string {
  return format(date, "EEEE d").toUpperCase();
}

// ============================================================================
// Local Timezone Strings to UTC Date Objects
// ============================================================================

/**
 * Converts a string in the format "YYYY-MM-DD" (from <input type="date">) to a Date object.
 * The date string is interpreted as midnight in the local timezone.
 *
 * @param date - A string in "YYYY-MM-DD" format (e.g., "2025-01-15")
 * @returns A Date object representing midnight on the specified date in local timezone
 * @example
 * ```ts
 * const dateString = "2025-01-15";
 * const date = parseDateInputValue(dateString); // Date object for Jan 15, 2025 at 00:00:00 local time
 * ```
 */
export function parseDateInputValue(date: string): Date {
  const [year, month, day] = date.split("-");
  return new Date(Number(year), Number(month) - 1, Number(day));
}

/**
 * Converts a string in the format "HH:mm" (from <input type="time">) to a Date object.
 * Since only time is provided, the date is set to January 1, 1970 (epoch date).
 * Use this when only the time portion matters.
 *
 * @param time - A string in "HH:mm" format (e.g., "14:30")
 * @returns A Date object with the specified time on January 1, 1970
 * @example
 * ```ts
 * const timeString = "14:30";
 * const date = parseTimeInputValue(timeString); // Date object for Jan 1, 1970 at 14:30:00
 * ```
 */
export function parseTimeInputValue(time: string): Date {
  const [hour, minute] = time.split(":");
  return new Date(0, 0, 0, Number(hour), Number(minute));
}