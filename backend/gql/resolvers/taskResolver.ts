import {
  DayOfWeek,
  DayPreference,
  Task,
  TaskType,
  TimePreference,
} from "@prisma/client";
import db from "../../prisma";

const taskResolver = {
  Query: {
    getTasksByType: async (
      _parent: undefined,
      {
        type,
      }: {
        type: TaskType;
      }
    ): Promise<Task[]> => {
      return db.task.findMany({
        where: { type },
      });
    },
  },
  Mutation: {
    createTask: async (
      _parent: undefined,
      {
        type,
        name,
        value,
        penalty,
        day_preference,
        days,
        time_preference,
        start_time,
        end_time,
        comment,
      }: {
        type: TaskType;
        name: string;
        value: number;
        penalty: number;
        day_preference: DayPreference;
        days: DayOfWeek[];
        time_preference: TimePreference;
        start_time?: Date;
        end_time?: Date;
        comment?: string;
      }
    ): Promise<Task> => {
      return db.task.create({
        data: {
          type,
          name,
          value,
          penalty,
          day_preference,
          days,
          time_preference,
          start_time,
          end_time,
          comment,
        },
      });
    },
    updateTask: async (
      _parent: undefined,
      {
        tid,
        type,
        name,
        value,
        penalty,
        day_preference,
        days,
        time_preference,
        start_time,
        end_time,
        comment,
      }: {
        tid: number;
        type?: TaskType;
        name?: string;
        value?: number;
        penalty?: number;
        day_preference?: DayPreference;
        days?: DayOfWeek[];
        time_preference?: TimePreference;
        start_time?: Date;
        end_time?: Date;
        comment?: string;
      }
    ): Promise<Task> => {
      const updates: Partial<Task> = {};
      if (type !== undefined) updates.type = type;
      if (name !== undefined) updates.name = name;
      if (value !== undefined) updates.value = value;
      if (penalty !== undefined) updates.penalty = penalty;
      if (day_preference !== undefined) updates.day_preference = day_preference;
      if (days !== undefined) updates.days = days;
      if (time_preference !== undefined)
        updates.time_preference = time_preference;
      if (start_time !== undefined) updates.start_time = start_time;
      if (end_time !== undefined) updates.end_time = end_time;
      if (comment !== undefined) updates.comment = comment;

      const isEmpty = Object.keys(updates).length === 0;
      if (isEmpty) throw new Error("no updates received");

      return db.task.update({
        where: { tid },
        data: updates,
      });
    },
    deleteTask: async (
      _parent: undefined,
      {
        tid,
      }: {
        tid: number;
      }
    ): Promise<Task> => {
      return db.task.delete({
        where: { tid },
      });
    },
  },
};

export default taskResolver;
