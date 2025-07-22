import {
  DayOfWeek,
  RecurrenceFrequency,
  Task,
  TaskType,
  Status,
  TimeOption,
} from "@prisma/client";
import TaskService from "../services/implementation/taskImplementation";
import ITaskService from "../services/interface/taskInterface";

const taskService: ITaskService = new TaskService();

const taskResolver = {
  Query: {
    getTasksByType: async (
      _parent: undefined,
      { type }: { type: TaskType }
    ): Promise<Array<Task>> => {
      return taskService.getTasksByType(type);
    },
  },
  Mutation: {
    createTask: async (
      _parent: undefined,
      {
        type,
        name,
        recurrencePreference,
        repeatDays,
        timePreference,
        marillacBucks,
        deduction,
        startTime,
        endTime,
        comment,
      }: {
        type: TaskType;
        name: string;
        recurrencePreference: RecurrenceFrequency;
        repeatDays: DayOfWeek[];
        timePreference: TimeOption;
        marillacBucks: number;
        deduction: number;
        startTime?: string;
        endTime?: string;
        comment?: string;
      }
    ): Promise<boolean> => {
      return taskService.createTask(
        type,
        name,
        recurrencePreference,
        repeatDays,
        timePreference,
        marillacBucks,
        deduction,
        startTime,
        endTime,
        comment
      );
    },
    updateTask: async (
      _parent: undefined,
      {
        id,
        type,
        name,
        recurrencePreference,
        repeatDays,
        timePreference,
        marillacBucks,
        deduction,
        startTime,
        endTime,
        comment,
      }: {
        id: number;
        type?: TaskType;
        name?: string;
        recurrencePreference?: RecurrenceFrequency;
        repeatDays?: DayOfWeek[];
        timePreference?: TimeOption;
        marillacBucks?: number;
        deduction?: number;
        startTime?: string;
        endTime?: string;
        comment?: string;
      }
    ): Promise<boolean> => {
      return taskService.updateTask(
        id,
        type,
        name,
        recurrencePreference,
        repeatDays,
        timePreference,
        marillacBucks,
        deduction,
        startTime,
        endTime,
        comment
      );
    },
    deleteTaskById: async (
      _parent: undefined,
      { taskId }: { taskId: number }
    ): Promise<boolean> => {
      return taskService.deleteTaskById(taskId);
    },
  },
};

export default taskResolver;
