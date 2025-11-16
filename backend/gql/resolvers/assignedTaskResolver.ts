import { AssignedTask, TaskStatus, TaskType } from "@prisma/client";
import { startOfWeek, endOfWeek, endOfDay, startOfDay } from "date-fns";
import db from "../../prisma";
import processEarning from "../../utils/transactionUtils";
import { updateBadgeLevelProgress } from "../../utils/badgeUtils";
import { PERFECT_SCORE_OPTIONAL, PERFECT_SCORE_REQUIRED } from "../../constants/systemBadges";

const assignedTaskResolver = {
  Query: {
    getNumberOfAssignedTasksByRoom: async (): Promise<number[]> => {
      const currentParticipants = await db.participant.findMany({
        where: {
          OR: [{ departure: null }, { departure: { gt: endOfDay(new Date()) } }],
        },
        select: {
          pid: true,
          room: true,
        },
      });

      const currentPids = currentParticipants.map((p) => p.pid);
      const pidToRoom = new Map(
        currentParticipants.map((p) => [p.pid, p.room])
      );

      if (currentParticipants.length === 0) return Array(10).fill(0);

      const assignedTaskCounts = await db.assignedTask.groupBy({
        by: ["pid"],
        where: {
          pid: { in: currentPids },
          status: TaskStatus.ASSIGNED,
        },
        _count: { aid: true },
      });

      const counts = Array(10).fill(0);
      assignedTaskCounts.forEach(({ pid, _count: count }) => {
        const room = pidToRoom.get(pid);
        if (room === undefined) return;
        counts[room - 1] += count.aid;
      });
      return counts;
    },
    getAssignedTasksForToday: async (
      _parent: undefined,
      {
        pid,
      }: {
        pid: number;
      }
    ): Promise<AssignedTask[]> => {
      return db.assignedTask.findMany({
        where: {
          pid,
          start_date: { lte: endOfDay(new Date()) },
          end_date: { gte: startOfDay(new Date()) },
        },
      });
    },
    getAssignedTasksByWeek: async (
      _parent: undefined,
      {
        pid,
        weekStart,
      }: {
        pid: number;
        weekStart: Date;
      }
    ): Promise<AssignedTask[]> => {
      return db.assignedTask.findMany({
        where: {
          pid,
          start_date: { lte: endOfWeek(weekStart) },
          end_date: { gte: weekStart },
        },
      });
    },
    hasCompletedAllRequiredTasks: async (
      _parent: undefined,
      {
        pid,
      }: {
        pid: number;
      }
    ): Promise<boolean> => {
      const requiredTasksNotComplete = await db.assignedTask.findMany({
        where: {
          pid,
          type: TaskType.REQUIRED,
          status: { not: TaskStatus.COMPLETE },
          start_date: { lte: endOfWeek(new Date()) },
          end_date: { gte: startOfWeek(new Date()) },
        },
      });

      return requiredTasksNotComplete.length === 0;
    },
  },
  Mutation: {
    createAssignedTask: async (
      _parent: undefined,
      {
        pid,
        name,
        type,
        value,
        penalty,
        start_date,
        end_date,
        comment,
      }: {
        pid: number;
        name: string;
        type: TaskType;
        value: number;
        penalty: number;
        start_date: Date;
        end_date: Date;
        comment?: string;
      }
    ): Promise<AssignedTask> => {
      return db.assignedTask.create({
        data: {
          pid,
          name,
          type,
          value,
          penalty,
          start_date,
          end_date,
          comment,
        },
      });
    },
    updateAssignedTask: async (
      _parent: undefined,
      {
        aid,
        pid,
        name,
        type,
        value,
        penalty,
        start_date,
        end_date,
        comment,
      }: {
        aid: number;
        pid?: number;
        name?: string;
        type?: TaskType;
        value?: number;
        penalty?: number;
        start_date?: Date;
        end_date?: Date;
        comment?: string;
      }
    ): Promise<AssignedTask> => {
      const updates: Partial<AssignedTask> = {};
      if (pid !== undefined) updates.pid = pid;
      if (name !== undefined) updates.name = name;
      if (type !== undefined) updates.type = type;
      if (value !== undefined) updates.value = value;
      if (penalty !== undefined) updates.penalty = penalty;
      if (start_date !== undefined) updates.start_date = start_date;
      if (end_date !== undefined) updates.end_date = end_date;
      if (comment !== undefined) updates.comment = comment;

      const isEmpty = Object.keys(updates).length === 0;
      if (isEmpty) throw new Error("no updates received");

      return db.assignedTask.update({
        where: { aid },
        data: updates,
      });
    },
    updateAssignedTaskStatus: async (
      _parent: undefined,
      {
        aid,
        status,
      }: {
        aid: number;
        status: TaskStatus;
      }
    ): Promise<AssignedTask> => {
      if (status === TaskStatus.ASSIGNED) {
        throw new Error("invalid status update");
      } else if (status === TaskStatus.COMPLETE) {
        const assignedTask = await db.assignedTask.findUnique({
          where: { aid },
        });
        if (assignedTask === null) throw new Error("assigned task not found");

        const reasonForEarning = `Required task ${assignedTask.name} completed!`;
        await processEarning(
          assignedTask.pid,
          assignedTask.value,
          reasonForEarning
        );

        if (assignedTask.type === TaskType.REQUIRED) {
          const weeklyRequiredTasks = await db.assignedTask.findMany({
            where: {
              pid: assignedTask.pid,
              status: { not: TaskStatus.COMPLETE },
              start_date: { lte: endOfWeek(new Date()) },
              end_date: { gte: startOfWeek(new Date()) },
              type: TaskType.REQUIRED,
            },
          });

          if (weeklyRequiredTasks.length === 0) {
            await updateBadgeLevelProgress(
              PERFECT_SCORE_REQUIRED,
              assignedTask.pid,
              1
            );
          }
        } else if (assignedTask.type === TaskType.OPTIONAL) {
          const countCompletedOptionalTasks = await db.assignedTask.count({
            where: {
              pid: assignedTask.pid,
              start_date: { lte: endOfWeek(new Date()) },
              end_date: { gte: startOfWeek(new Date()) },
              type: TaskType.OPTIONAL,
              status: TaskStatus.COMPLETE,
            },
          });

          if (countCompletedOptionalTasks === 2) {
            await updateBadgeLevelProgress(
              PERFECT_SCORE_OPTIONAL,
              assignedTask.pid,
              1
            );
          }
        }

        // TODO (victor): add jack of all trades, first goal, individual goal badge logic

        // Jack of All Trades:
        // If the task that's just been completed has not been completed before, update badge level progress for the JACK_OF_ALL_TRADES badge by 1
        // For this badge, you might need to add tid to the AssignedTask table (not as a FK referencing the Task table, just as an attribute, since if the referenced Task is deleted we still want to preserve the state of the AssignedTask)
        // Places you might need to update with this new property include (types/models.ts, types/resolvers.ts, prisma/schema.prisma, createAssignedTask resolver)
        // To process new schema changes, you'll need to run the following commands:
        // npx prisma migrate reset
        // npx prisma migrate dev
        // npx @snaplet/seed sync
        // Also ensure that the mp_db container is running and you've set DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mp after the container is setup

        // First Goal: 
        // No condition needs to be checked, just call updateBadgeLevelProgress for the FIRST_GOAL badge with inc = 1

        // Individual Goal:
        // Check if all assigned tasks of type INDIVIDUAL_GOAL have been completed for the week, if so, update badge level progress for the INDIVIDUAL_GOAL badge by 1

      }

      return db.assignedTask.update({
        where: { aid },
        data: { status },
      });
    },
    deleteAssignedTask: async (
      _parent: undefined,
      {
        aid,
      }: {
        aid: number;
      }
    ): Promise<AssignedTask> => {
      return db.assignedTask.delete({
        where: { aid },
      });
    },
  },
};

export default assignedTaskResolver;
