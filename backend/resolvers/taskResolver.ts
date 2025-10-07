import {
  DayOfWeek,
  PrismaClient,
  RecurrenceFrequency,
  Task,
  TaskType,
  TimeOption,
} from "@prisma/client";

const prisma = new PrismaClient();

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
      { type }: { type: TaskType }
    ): Promise<Array<Task>> => {
      return await prisma.task.findMany({
          where: { task_type: type },
      })
    },
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
      }
    ): Promise<boolean> => {
      await prisma.task.create({
        data: {
          task_type: type,
          task_name: name,
          recurrence_preference: recurrencePreference,
          repeat_days: repeatDays,
          time_preference: timePreference,
          marillac_bucks_addition: marillacBucks,
          marillac_bucks_deduction: deduction,
          start_time: startTime,
          end_time: endTime,
          comment,
        },
      });
      return true;
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
      const updatedData: Record<string, any> = {};
      if (type) updatedData.task_type = type;
      if (name) updatedData.task_name = name;
      if (recurrencePreference)
        updatedData.recurrence_preference = recurrencePreference;
      if (repeatDays) updatedData.repeat_days = repeatDays;
      if (timePreference) updatedData.time_preference = timePreference;
      if (marillacBucks) updatedData.marillac_bucks_addition = marillacBucks;
      if (deduction) updatedData.marillac_bucks_deduction = deduction;
      if (startTime) updatedData.start_time = startTime;
      if (endTime) updatedData.end_time = endTime;
      if (comment) updatedData.comment = comment;

      await prisma.task.update({
        where: { task_id: id },
        data: updatedData,
      });
      return true;
    },
    deleteTaskById: async (
      _parent: undefined,
      { taskId }: { taskId: number }
    ): Promise<boolean> => {
      await prisma.task.delete({
        where: { task_id: taskId },
      });
      return true;
    },
    deleteAssignedTask: async (
      _parent: undefined,
      { assigned_task_id }: { assigned_task_id: number }
    ): Promise<boolean> => {
      await prisma.assignedTask.delete({
        where: { assigned_task_id: assigned_task_id },
      });
      return true;
    },
  },
};

export default taskResolver;
