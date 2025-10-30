export interface AssignedTask {
  assigned_task_id: number;
  task_name: string;
  task_status: TaskStatus;
  task_type: TaskType;
  goal_name?: string;
  goal_description?: string;
  start_date: string;
  end_date: string;
  marillac_bucks_addition: number;
  marillac_bucks_deduction: number;
  comment?: string;
}

export interface ParticipantData {
  participant_id: number;
  marillac_bucks: number;
  room_number: number;
  assigned_tasks: CalendarEvent[];
}

export enum TaskStatus {
  ASSIGNED = "ASSIGNED",
  INCOMPLETE = "INCOMPLETE",
  COMPLETE = "COMPLETE",
  EXCUSED = "EXCUSED",
}

export const TaskStatuses = [
  TaskStatus.ASSIGNED,
  TaskStatus.COMPLETE,
  TaskStatus.INCOMPLETE,
  TaskStatus.EXCUSED,
];

export enum TaskType {
  REQUIRED = "REQUIRED",
  OPTIONAL = "OPTIONAL",
  INDIVIDUAL_GOAL = "INDIVIDUAL_GOAL",
}

export interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  task_status: TaskStatus;
  task_type: TaskType;
  marillacBucksAddition: number;
  marillacBucksDeduction: number;
  comment?: string;
}

export enum ScheduleView {
  LIST = "LIST",
  CALENDAR = "CALENDAR",
}

export interface TaskSection {
  title: string;
  tasks: AssignedTask[];
}

// Legacy interfaces for backward compatibility
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
