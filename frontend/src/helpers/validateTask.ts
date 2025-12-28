import { DayOfWeek, DayPreference, TimePreference } from "../types/enums";

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
    if (dayPreference === DayPreference.PARTICIPANT_PREFERENCE || timePreference === TimePreference.PARTICIPANT_PREFERENCE) {
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
