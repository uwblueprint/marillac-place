import {
  TaskType,
  DayOfWeek,
  Task,
  RecurrenceFrequency,
  TimeOption,
} from "@prisma/client";

interface ITaskService {
  // getTaskById(taskId: number): Promise<Task>;
  getTasksByType(type: TaskType): Promise<Task[]>;
  // getTasksByRecurrenceFrequency(recurrencePreference: RecurrenceFrequency): Promise<Task[]>;

  createTask(
    type: TaskType,
    name: string,
    recurrencePreference: RecurrenceFrequency,
    repeatDays: DayOfWeek[],
    timePreference: TimeOption,
    marillacBucks: number,
    deduction: number,
    startTime?: string,
    endTime?: string,
    comment?: string,
  ): Promise<boolean>;
  updateTask(
    id: number,
    type?: TaskType,
    name?: string,
    recurrencePreference?: RecurrenceFrequency,
    repeatDays?: DayOfWeek[],
    timePreference?: TimeOption,
    marillacBucks?: number,
    deduction?: number,
    startTime?: string,
    endTime?: string,
    comment?: string,
  ): Promise<boolean>;
  deleteTaskById(taskId: number): Promise<boolean>;
}

export default ITaskService;
