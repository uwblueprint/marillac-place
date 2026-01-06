import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { toZonedTime, fromZonedTime } from "date-fns-tz";

const timeZone = "America/Toronto";

export function getESTDate(utcDate: Date): Date {
  return toZonedTime(utcDate, timeZone);
}

export function getUTCDate(estDate: Date): Date {
  return fromZonedTime(estDate, timeZone);
}

export function getStartOfDay(utcDate: Date): Date {
  const estDate = getESTDate(utcDate);
  const startOfDayEST = startOfDay(estDate);
  const startOfDayUTC = getUTCDate(startOfDayEST);
  return startOfDayUTC;
}

export function getEndOfDay(utcDate: Date): Date {
  const estDate = getESTDate(utcDate);
  const endOfDayEST = endOfDay(estDate);
  const endOfDayUTC = getUTCDate(endOfDayEST);
  return endOfDayUTC;
}

export function getStartOfWeek(utcDate: Date): Date {
  const estDate = getESTDate(utcDate);
  const startOfWeekEST = startOfWeek(estDate);
  const startOfWeekUTC = getUTCDate(startOfWeekEST);
  return startOfWeekUTC;
}

export function getEndOfWeek(utcDate: Date): Date {
  const estDate = getESTDate(utcDate);
  const endOfWeekEST = endOfWeek(estDate);
  const endOfWeekUTC = getUTCDate(endOfWeekEST);
  return endOfWeekUTC;
}

export function getStartOfMonth(utcDate: Date): Date {
  const estDate = getESTDate(utcDate);
  const startOfMonthEST = startOfMonth(estDate);
  const startOfMonthUTC = getUTCDate(startOfMonthEST);
  return startOfMonthUTC;
}

export function getEndOfMonth(utcDate: Date): Date {
  const estDate = getESTDate(utcDate);
  const lastDayOfMonthEST = endOfMonth(estDate);
  const lastDayOfMonthUTC = getUTCDate(lastDayOfMonthEST);
  return lastDayOfMonthUTC;
}

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
}
