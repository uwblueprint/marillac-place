import { addDays, startOfWeek, set, startOfDay } from "date-fns";
import { DAYS } from "../constants/days";
import { DayOfWeek, DayPreference, TimePreference } from "../types/enums";
import { now } from "./formatDateTime";

type TaskValidationResult = {
  isValid: boolean;
  errorMessage: string;
};

export function isValidTask(
  taskName: string,
  participantPreference: boolean,
  dayPreference: DayPreference | null,
  days: DayOfWeek[],
  timePreference: TimePreference | null,
  startTime: Date | null,
  endTime: Date | null,
  addition: number,
  deduction: number
): TaskValidationResult {
  if (!taskName) {
    return { isValid: false, errorMessage: "Task name is missing" };
  }
  if (addition < 0 || deduction < 0) {
    return {
      isValid: false,
      errorMessage: "Marillac bucks require positive values",
    };
  }

  if (!participantPreference) {
    if (
      dayPreference === null ||
      (dayPreference !== DayPreference.DAY_RANGE && timePreference === null)
    ) {
      return {
        isValid: false,
        errorMessage: "Day and time preferences are required",
      };
    }
    if (
      dayPreference === DayPreference.PARTICIPANT_PREFERENCE ||
      timePreference === TimePreference.PARTICIPANT_PREFERENCE
    ) {
      return {
        isValid: false,
        errorMessage: "Invalid day or time preference",
      };
    }
    if (
      dayPreference === DayPreference.DAY_RANGE &&
      timePreference !== TimePreference.ANYTIME
    ) {
      return {
        isValid: false,
        errorMessage: "Anyday tasks must also be anytime tasks",
      };
    }
    if (dayPreference === DayPreference.DAY_RANGE && days.length <= 1) {
      return { isValid: false, errorMessage: "Invalid day range" };
    }
    if (
      dayPreference === DayPreference.EVERY_SELECTED_DAYS &&
      days.length === 0
    ) {
      return {
        isValid: false,
        errorMessage: "Please specify at least one day",
      };
    }
    if (timePreference === TimePreference.SPECIFIC) {
      if (startTime === null || endTime === null) {
        return {
          isValid: false,
          errorMessage: "Start and end times are required",
        };
      }
      if (startTime >= endTime) {
        return {
          isValid: false,
          errorMessage: "Start time should be earlier than end time",
        };
      }
    }
  }

  return { isValid: true, errorMessage: "" };
}

type StartAndEndDates = {
  startDate: Date;
  endDate: Date;
};

export function getStartAndEndDates(
  dayPreference: DayPreference,
  days: DayOfWeek[],
  timePreference: TimePreference,
  startTime: Date | null,
  endTime: Date | null
): StartAndEndDates[] {
  if (dayPreference === DayPreference.DAILY) {
    return DAYS.map((day: DayOfWeek) => {
      const baseDate = addDays(startOfWeek(now()), DAYS.indexOf(day));

      if (
        timePreference === TimePreference.SPECIFIC &&
        startTime !== null &&
        endTime !== null
      ) {
        const startDate = set(baseDate, {
          hours: startTime.getHours(),
          minutes: startTime.getMinutes(),
          seconds: startTime.getSeconds(),
          milliseconds: startTime.getMilliseconds(),
        });

        const endDate = set(baseDate, {
          hours: endTime.getHours(),
          minutes: endTime.getMinutes(),
          seconds: endTime.getSeconds(),
          milliseconds: endTime.getMilliseconds(),
        });

        return { startDate, endDate };
      }

      const startDate = startOfDay(baseDate);
      const endDate = addDays(startDate, 1);
      return { startDate, endDate };
    });
  }
  if (dayPreference === DayPreference.EVERY_SELECTED_DAYS) {
    return days.map((day: DayOfWeek) => {
      const baseDate = addDays(startOfWeek(now()), DAYS.indexOf(day));

      if (
        timePreference === TimePreference.SPECIFIC &&
        startTime !== null &&
        endTime !== null
      ) {
        const startDate = set(baseDate, {
          hours: startTime.getHours(),
          minutes: startTime.getMinutes(),
          seconds: startTime.getSeconds(),
          milliseconds: startTime.getMilliseconds(),
        });

        const endDate = set(baseDate, {
          hours: endTime.getHours(),
          minutes: endTime.getMinutes(),
          seconds: endTime.getSeconds(),
          milliseconds: endTime.getMilliseconds(),
        });

        return { startDate, endDate };
      }

      const startDate = startOfDay(baseDate);
      const endDate = addDays(startDate, 1);
      return { startDate, endDate };
    });
  }

  const startDate = addDays(startOfWeek(now()), DAYS.indexOf(days[0]));

  const endDate = addDays(startOfWeek(now()), DAYS.indexOf(days[1]) + 1);

  return [{ startDate, endDate }];
}
