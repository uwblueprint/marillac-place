export type TaskType = "REQUIRED" | "OPTIONAL" | "CUSTOM" | "CHORE";

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

export enum RecurrenceFrequency {
  ONE_TIME = "ONE_TIME",
  REPEATS_PER_WEEK_SELECTED = "REPEATS_PER_WEEK_SELECTED",
  REPEATS_PER_WEEK_ONCE = "REPEATS_PER_WEEK_ONCE",
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
  CHORE = "CHORE",
  ACHIEVEMENT = "ACHIEVEMENT",
}

export type TaskResponse = {
  id: number;
  type: TaskTypeEnum;
  name: string;
  credit: number;
  start: Date;
  end?: Date;
  isReccuring: boolean;
  repeatDays?: DaysOfWeek[];
};

export type TaskRequest = {
  type: TaskTypeEnum;
  name: string;
  credit: number;
  start: Date;
  end?: Date;
  isRecurring: boolean;
  repeatDays?: DaysOfWeek[];
};