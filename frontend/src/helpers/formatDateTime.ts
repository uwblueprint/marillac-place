import { format, parse } from "date-fns";

// e.g. January 1, 2026
export function formatDateV1(date: Date): string {
  return format(date, "MMMM d, yyyy");
};

// e.g. 2:30 PM
export function formatDateV2(date: Date): string {
  return format(date, "h:mm a");
};

// e.g. Jan 1, 2:30 PM
export function formatDateV3(date: Date): string {
  return format(date, "MMM d, h:mm a");
};

// e.g. THURSDAY 1
export function formatDateV4(date: Date): string {
  return format(date, "EEEE d").toUpperCase();
};

// e.g. JANUARY 2025
export function formatDateV5(date: Date): string {
  return format(date, "MMMM yyyy").toUpperCase();
};

// e.g. Jan 1, 2026
export function formatDateV6(date: Date): string {
  return format(date, "MMM d, yyyy");
};

// e.g. Thursday, Jan 1
export function formatDateV7(date: Date): string {
  return format(date, "EEEE, MMM d");
};

// e.g. Thursday - January 1, 2026
export function formatDateV8(date: Date): string {
  return format(date, "EEEE - MMM d, yyyy");
};

export function formatDateInputValue(date: Date): string {
  return format(date, "yyyy-MM-dd");
};

export function parseDateInputValue(date: string): Date {
  return parse(date, "yyyy-MM-dd", new Date());
};

export function formatTimeInputValue(date: Date): string {
  return format(date, "HH:mm");
};

export function parseTimeInputValue(time: string): Date {
  return parse(time, "HH:mm", new Date());
};

export function combineDayAndTime(day: Date, time: Date): Date {
  return new Date(
    day.getFullYear(),
    day.getMonth(),
    day.getDate(),
    time.getHours(),
    time.getMinutes(),
    time.getSeconds(),
    time.getMilliseconds()
  );
};
