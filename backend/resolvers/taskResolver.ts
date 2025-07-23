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
    getTasksByType: async (
      _parent: undefined,
      { type }: { type: TaskType },
    ): Promise<Array<Task>> => {
      return taskService.getTasksByType(type);
    },
    // getTasksByRecurrenceFrequency: async (
    //   _parent: undefined,
    //   { recurrencePreference }: { recurrencePreference: RecurrenceFrequency },
    // ): Promise<Task[]> => {
    //   return taskService.getTasksByRecurrenceFrequency(recurrencePreference);
    // },
    getAssignedTasksByParticipantIdAndDate: async (
      _parent: undefined,
      { participantId, date }: { participantId: number; date: string }
    ) => {
      return taskService.getAssignedTasksByParticipantIdAndDate(participantId, date);
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
      },
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
        comment,
      );
    },
    deleteTaskById: async (
      _parent: undefined,
      { taskId }: { taskId: number },
    ): Promise<boolean> => {
      return taskService.deleteTaskById(taskId);
    },
    deleteAssignedTask: async (
      _parent: undefined,
      { assigned_task_id }: { assigned_task_id: number },
    ): Promise<boolean> => {
      return taskService.deleteAssignedTask(assigned_task_id);
    },
  },
};

export default taskResolver;
