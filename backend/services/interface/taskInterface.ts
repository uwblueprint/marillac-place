import { TaskType, DaysOfWeek, Task } from "@prisma/client";

export interface TaskDTO {
  id: number;
  type: TaskType;
  title: string;
  creditValue: number;
  start: Date;
  end: Date | null;
  isRecurring: boolean;
  repeatDays: DaysOfWeek[];
}

interface ITaskService {

  getTaskById(taskId: number): Promise<Task>;
  getTasksByType(type: TaskType): Promise<Task[]>;
  getTasksByStartDate(startDate: Date): Promise<Task[]>;

  createTask(
    type: TaskType,
    name: string,
    credit: number,
    start: Date,
    end: Date,
    isRecurring: boolean,
    repeatDays: DaysOfWeek[],
  ): Promise<Task>;
  updateTaskById(
    taskId: number,
    type: TaskType,
    name: string,
    credit: number,
    start: Date,
    end: Date,
    isRecurring: boolean,
    repeatDays: DaysOfWeek[],
  ): Promise<Task>;
  deleteTaskById(taskId: number): Promise<Task>;
}

export default ITaskService;
