import { format, parse } from "date-fns";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";

export const now = () => toZonedTime(new Date(), "America/New_York");

/**
 * Formats date into a human-readable format given a date object in EST.
 *
 * @param date - A date object interpreted as EST
 * @returns A formatted date string
 * @example
 * ```ts
 * const date = new Date();
 * const formatted = formatDateStringUTC(date); // "January 15, 2025"
 * ```
 */
export function formatDateStringEST(date: Date): string {
  return formatInTimeZone(date, "America/New_York", "MMMM d, yyyy");
}

/**
 * Formats month and year into a human-readable format given a date object in EST.
 *
 * @param date - A date object interpreted as EST
 * @returns A formatted month string
 * @example
 * ```ts
 * const date = new Date();
 * const formatted = formatMonthStringEST(date); // "JANUARY 2025"
 * ```
 */
export function formatMonthStringEST(date: Date): string {
  return formatInTimeZone(date, "America/New_York", "MMMM yyyy").toUpperCase();
}

/**
 * Formats day and date into a human-readable format given a date object in EST.
 *
 * @param date - A date object interpreted as EST
 * @returns A formatted day string
 * @example
 * ```ts
 * const date = new Date();
 * const formatted = formatDayStringEST(date); // "WEDNESDAY 15"
 * ```
 */
export function formatDayStringEST(date: Date): string {
  return formatInTimeZone(date, "America/New_York", "EEEE d").toUpperCase();
}

/**
 * Format date and time to a UTC date string format given a date object in EST (no conversion)
 *
 * @param date - A date object interpreted as EST
 * @returns A string in UTC format
 * @example
 * ```ts
 * const date = new Date();
 * const formatted = formatUTCDateStringEST(date); // "2025-01-15T14:30:00Z"
 * ```
 */
export const formatUTCDateStringEST = (date: Date) => {
  const est = date.toLocaleString("en-CA", {
    timeZone: "America/New_York",
    hour12: false,
  });
  const [day, time] = est.split(", ");
  const utcString = `${day}T${time}Z`;
  return utcString;
}

/**
 * Formats date and time to a human-readable format given a date string in UTC
 *
 * @param date - A date string in UTC
 * @returns A formatted date and time string 
 * @example
 * ```ts
 * const date = "2025-01-15T14:30:00Z";
 * const formatted = formatDateTimeStringUTC(date); // "Jan 15, 2:30 PM"
 * ```
 */
export function formatDateTimeStringUTC(date: string): string {
  return formatInTimeZone(date, "UTC", "MMM d, h:mm a");
}

/**
 * Formats time to a human-readable format given a date string in UTC
 *
 * @param date - A date string in UTC
 * @returns A formatted time string
 * @example
 * ```ts
 * const date = "2025-01-15T14:30:00Z";
 * const formatted = formatTimeStringUTC(date); // "2:30 PM"
 * ```
 */
export function formatTimeStringUTC(date: string): string {
  return formatInTimeZone(date, "UTC", "h:mm a");
}

/**
 * Creates an EST date object given a date string in UTC (no conversion)
 *
 * @param date - A date string in UTC
 * @returns A Date object in EST
 * @example
 * ```ts
 * const date = "2025-01-15T14:30:00.000Z";
 * const formatted = createESTDateObjectUTC(date); // Date object for Jan 15, 2025 at 2:30:00 PM EST
 * ```
 */
export function createESTDateObjectUTC(date: string): Date {
  return parse(date, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", new Date());
}









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
