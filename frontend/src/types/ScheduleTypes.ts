export type ScheduleType = "LIST" | "CALENDAR"

export interface Task {
  title: string;
  description: string;
  creditValue: number;
}

export interface CustomTask extends Task {
  room: number;
}

export interface ChoreTask extends Task {
  location: string;
}
