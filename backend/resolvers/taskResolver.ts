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
    deleteAssignedTask: async (
      _parent: undefined,
      { assigned_task_id }: { assigned_task_id: number }
    ): Promise<boolean> => {
      return taskService.deleteAssignedTask(assigned_task_id);
    },
    editAssignedTask: async (
      _parent: undefined,
      {
        assignedTaskId,
        goalName,
        goalDescription,
        startDate,
        taskStatus,
        endDate,
        marillacBucksAddition,
        marillacBucksDeduction,
        comment,
      }: {
        assignedTaskId: number;
        goalName?: string;
        goalDescription?: string;
        startDate?: string;
        endDate?: string;
        taskStatus?: Status;
        marillacBucksAddition?: number;
        marillacBucksDeduction?: number;
        comment?: string;
      }
    ): Promise<boolean> => {
      return taskService.editAssignedTask(
        assignedTaskId,
        goalName,
        goalDescription,
        startDate,
        endDate,
        taskStatus,
        marillacBucksAddition,
        marillacBucksDeduction,
        comment
      );
    },
  },
};

export default taskResolver;
