export type TaskType = "REQUIRED" | "OPTIONAL" | "CUSTOM" | "CHORE";
export type RecurrenceFrequency =
  | "ONE_TIME"
  | "REPEATS_PER_WEEK_SELECTED"
  | "REPEATS_PER_WEEK_ONCE";
export type DaysOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export interface Task {
  id: string;
  type: TaskType;
  title: string;
  description: string;
  creditValue: number;
  locationId: number;
  endDate?: Date;
  recurrenceFrequency: RecurrenceFrequency;
  specificDay?: DaysOfWeek;
  repeatDays: DaysOfWeek[];
}

export interface CustomTask extends Task {
  room: number;
}

export interface ChoreTask extends Task {
  location: string;
}
