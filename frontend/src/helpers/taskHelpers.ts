import {
  addDays,
  startOfWeek,
  startOfDay,
  isSameDay,
  endOfDay,
  isEqual,
} from "date-fns";
import { DAYS } from "../constants/days";
import { DayOfWeek, DayPreference, TimePreference } from "../types/enums";
import { AssignedTask, Task } from "../types/models";
import { combineDayAndTime } from "./formatDateTime";

export function isAllDayTask(assignedTask: AssignedTask): boolean {
  const startDate = new Date(assignedTask.start_date);
  const endDate = new Date(assignedTask.end_date);
  const allDay = (
    !isSameDay(startDate, endDate) ||
    (isEqual(startOfDay(startDate), startDate) &&
      isEqual(endOfDay(endDate), endDate))
  );
  return allDay;
}

type TaskValidationResult = {
  isValid: boolean;
  errorMessage: string;
};

export function isValidTask(task: Task): TaskValidationResult {
  const {
    name,
    value,
    penalty,
    day_preference,
    days,
    time_preference,
    start_time,
    end_time,
  } = task;
  if (!name) {
    return { isValid: false, errorMessage: "Task name is missing" };
  }
  if (value < 0 || penalty < 0) {
    return {
      isValid: false,
      errorMessage: "Marillac bucks require positive values",
    };
  }

  if (
    (day_preference === DayPreference.PARTICIPANT_PREFERENCE &&
      time_preference !== TimePreference.PARTICIPANT_PREFERENCE) ||
    (time_preference === TimePreference.PARTICIPANT_PREFERENCE &&
      day_preference !== DayPreference.PARTICIPANT_PREFERENCE)
  ) {
    return {
      isValid: false,
      errorMessage: "Day and time preferences must be consistent",
    };
  }

  if (
    day_preference !== DayPreference.PARTICIPANT_PREFERENCE &&
    time_preference !== TimePreference.PARTICIPANT_PREFERENCE
  ) {
    if (
      day_preference === DayPreference.DAY_RANGE &&
      time_preference !== TimePreference.ANYTIME
    ) {
      return {
        isValid: false,
        errorMessage: "Anyday tasks must also be anytime tasks",
      };
    }
    if (day_preference === DayPreference.DAY_RANGE && days.length <= 1) {
      return { isValid: false, errorMessage: "Invalid day range" };
    }
    if (
      day_preference === DayPreference.EVERY_SELECTED_DAYS &&
      days.length === 0
    ) {
      return {
        isValid: false,
        errorMessage: "Please specify at least one day",
      };
    }
    if (time_preference === TimePreference.SPECIFIC) {
      if (!start_time || !end_time) {
        return {
          isValid: false,
          errorMessage: "Start and end times are required",
        };
      }
      if (new Date(start_time) >= new Date(end_time)) {
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

export function getStartAndEndDates(task: Task): StartAndEndDates[] {
  const { day_preference, time_preference, days, start_time, end_time } = task;

  if (
    day_preference === DayPreference.PARTICIPANT_PREFERENCE ||
    time_preference === TimePreference.PARTICIPANT_PREFERENCE
  ) {
    throw new Error(
      "Day and time preferences must be strictly defined to determine start and end dates"
    );
  }

  const now = new Date();
  const weekStart = startOfWeek(now);

  const startTime: Date = start_time ? new Date(start_time) : startOfDay(now);
  const endTime: Date = end_time ? new Date(end_time) : endOfDay(now);

  const startAndEndDates: StartAndEndDates[] = [];
  if (day_preference === DayPreference.DAILY) {
    DAYS.forEach((day: DayOfWeek) => {
      const baseDate = addDays(weekStart, DAYS.indexOf(day));
      const startDate = combineDayAndTime(baseDate, startTime);
      const endDate = combineDayAndTime(baseDate, endTime);
      startAndEndDates.push({ startDate, endDate });
    });
  } else if (day_preference === DayPreference.EVERY_SELECTED_DAYS) {
    task.days.forEach((day: DayOfWeek) => {
      const baseDate = addDays(weekStart, DAYS.indexOf(day));
      const startDate = combineDayAndTime(baseDate, startTime);
      const endDate = combineDayAndTime(baseDate, endTime);
      startAndEndDates.push({ startDate, endDate });
    });
  } else if (day_preference === DayPreference.DAY_RANGE) {
    if (days.length <= 1) {
      throw new Error("Day range should contain at least two days");
    }
    const baseStartDate = addDays(weekStart, DAYS.indexOf(days[0]));
    const baseEndDate = addDays(weekStart, DAYS.indexOf(days[days.length - 1]));
    const startDate = combineDayAndTime(baseStartDate, startTime);
    const endDate = combineDayAndTime(baseEndDate, endTime);
    startAndEndDates.push({ startDate, endDate });
  }
  return startAndEndDates;
}
