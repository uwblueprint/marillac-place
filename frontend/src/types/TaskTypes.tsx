export type TaskType = "REQUIRED" | "OPTIONAL" | "CUSTOM";

export interface Task {
  id: number;
  title: string;
  description: string;
  creditValue: number;
}

export interface ChoreTask extends Task {
  location: string;
}

export enum Status {
  PENDING_APPROVAL = "PENDING_APPROVAL",
  ASSIGNED = "ASSIGNED",
  INCOMPLETE = "INCOMPLETE",
  COMPLETE = "COMPLETE",
  EXCUSED = "EXCUSED",
}

export enum DaysOfWeek {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY",
}

export enum TaskTypeEnum {
  REQUIRED = "REQUIRED",
  OPTIONAL = "OPTIONAL",
  CUSTOM = "CUSTOM",
}
export enum RecurrenceFrequency {
  DAILY = "DAILY",
  EVERY_SELECTED_DAYS = "EVERY_SELECTED_DAYS",
  ANY_SELECTED_DAYS = "ANY_SELECTED_DAYS",
}
export enum TimeOption {
  ANYTIME = "ANYTIME",
  SPECIFIC = "SPECIFIC",
}

export type TaskResponse = {
  taskId: number;
  type: TaskTypeEnum;
  name: string;
  recurrencePreference: RecurrenceFrequency;
  repeatDays: DaysOfWeek[];
  timePreference: TimeOption;
  credit: number;
  deduction: number;
  start?: string;
  end?: string;
  comment?: string;
};

export type TaskRequest = {
  type: TaskTypeEnum;
  name: string;
  recurrencePreference: RecurrenceFrequency;
  repeatDays: DaysOfWeek[];
  timePreference: TimeOption;
  credit: number;
  deduction: number;
  start?: string;
  end?: string;
  comment?: string;
};
