import {
  DayOfWeek,
  RecurrenceFrequency,
  Task,
  TaskType,
  TimeOption,
} from "@prisma/client";
import TaskService from "../services/implementation/taskImplementation";
import ITaskService from "../services/interface/taskInterface";

const taskService: ITaskService = new TaskService();

const taskResolver = {
  Query: {
    // getTaskById: async (
    //   _parent: undefined,
    //   { taskId }: { taskId: number },
    // ): Promise<Task> => {
    //   return taskService.getTaskById(taskId);
    // },
    // getTasksByType: async (
    //   _parent: undefined,
    //   { type }: { type: TaskType },
    // ): Promise<Array<Task>> => {
    //   return taskService.getTasksByType(type);
    // },
    // getTasksByRecurrenceFrequency: async (
    //   _parent: undefined,
    //   { recurrencePreference }: { recurrencePreference: RecurrenceFrequency },
    // ): Promise<Task[]> => {
    //   return taskService.getTasksByRecurrenceFrequency(recurrencePreference);
    // },
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
      },
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
        comment,
      );
    },
    // updateTask: async (
    //   _parent: undefined,
    //   {
    //     taskId,
    //     type,
    //     name,
    //     recurrencePreference,
    //     repeatDays,
    //     timePreference,
    //     credit,
    //     deduction,
    //     start,
    //     end,
    //     comment,
    //   }: {
    //     taskId: number;
    //     type: TaskType;
    //     name: string;
    //     recurrencePreference: RecurrenceFrequency;
    //     repeatDays: DaysOfWeek[];
    //     timePreference: TimeOption;
    //     credit: number;
    //     deduction: number;
    //     start: string;
    //     end: string;
    //     comment: string;
    //   },
    // ): Promise<Task> => {
    //   const updatedTask = await taskService.updateTaskById(
    //     taskId,
    //     type,
    //     name,
    //     recurrencePreference,
    //     repeatDays,
    //     timePreference,
    //     credit,
    //     deduction,
    //     start,
    //     end,
    //     comment,
    //   );
    //   return updatedTask;
    // },
    // deleteTask: async (
    //   _parent: undefined,
    //   { taskId }: { taskId: number },
    // ): Promise<Task> => {
    //   const deletedTask = await taskService.deleteTaskById(taskId);
    //   return deletedTask;
    // },
  },
};

export default taskResolver;
