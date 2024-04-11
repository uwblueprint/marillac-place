export type TaskType = "REQUIRED" | "OPTIONAL" | "CUSTOM" | "CHORE";

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
