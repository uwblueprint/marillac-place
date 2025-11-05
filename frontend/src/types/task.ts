export enum TaskType {
  REQUIRED = "REQUIRED",
  OPTIONAL = "OPTIONAL",
  INDIVIDUAL_GOAL = "INDIVIDUAL_GOAL",
}

export enum RecurrenceFrequency {
  DAILY = "DAILY",
  EVERY_SELECTED_DAYS = "EVERY_SELECTED_DAYS",
  ANY_SELECTED_DAYS = "ANY_SELECTED_DAYS",
  PARTICIPANT_PREFERENCE = "PARTICIPANT_PREFERENCE",
}

export enum DayOfWeek {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY",
}

export enum TimeOption {
  ANYTIME = "ANYTIME",
  SPECIFIC = "SPECIFIC",
  PARTICIPANT_PREFERENCE = "PARTICIPANT_PREFERENCE",
}

export type TaskInfo = {
  task_id: number;
  task_name: string;
  task_type: TaskType;
  recurrence_preference: RecurrenceFrequency;
  repeat_days: DayOfWeek[];
  time_preference: TimeOption;
  start_time?: string;
  end_time?: string;
  marillac_bucks_addition: number;
  marillac_bucks_deduction: number;
  comment?: string;
};
