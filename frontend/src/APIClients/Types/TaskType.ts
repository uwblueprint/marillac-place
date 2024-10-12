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

export type TaskLocation = {
  id: number;
  title: string;
  description: string;
};

export type TaskResponse = {
  id: number;
  type: TaskTypeEnum;
  title: string;
  description: string;
  creditValue: number;
  location: TaskLocation;
  tasksAssigned: TaskResponse[];
  endDate?: Date;
  recurrenceFrequency: RecurrenceFrequency;
  specificDay?: DaysOfWeek;
  repeatDays?: DaysOfWeek[];
};

export type TaskRequest = {
  type: TaskTypeEnum;
  title: string;
  description: string;
  creditValue: number;
  locationId: number;
  endDate?: Date;
  recurrenceFrequency: RecurrenceFrequency;
  specificDay?: DaysOfWeek;
  repeatDays?: DaysOfWeek[];
};

export type TaskAssignedResponse = {
  id: number;
  taskId: number;
  assigneeId: number;
  assignerId: number;
  status: Status;
  startDate: Date;
  comments?: string;
};

export type TaskAssignedRequest = {
  taskId?: number;
  assigneeId?: number;
  assignerId?: number;
  status?: Status;
  startDate?: Date;
  comments?: string;
};
