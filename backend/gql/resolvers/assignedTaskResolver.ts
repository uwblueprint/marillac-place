import { AssignedTask, TaskStatus, TaskType } from "@prisma/client";
import { startOfWeek, endOfWeek, endOfDay, startOfDay } from "date-fns";
import db from "../../prisma";
import processEarning from "../../utils/transactionUtils";
import { updateBadgeLevelProgress } from "../../utils/badgeUtils";
import {
  PERFECT_SCORE_OPTIONAL,
  PERFECT_SCORE_REQUIRED,
  JACK_OF_ALL_TRADES,
  FIRST_GOAL,
  INDIVIDUAL_GOAL,
} from "../../constants/systemBadges";
import { now } from "../../utils/dateUtils";

const assignedTaskResolver = {
  Query: {
    getNumberOfAssignedTasksByRoom: async (): Promise<number[]> => {
      const currentParticipants = await db.participant.findMany({
        where: {
          OR: [{ departure: null }, { departure: { gt: endOfDay(now()) } }],
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
          start_date: { lte: endOfDay(now()) },
          end_date: { gte: startOfDay(now()) },
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
        weekStart: string;
      }
    ): Promise<AssignedTask[]> => {
      const weekStartDate = new Date(weekStart);
      return db.assignedTask.findMany({
        where: {
          pid,
          start_date: { lte: endOfWeek(weekStartDate) },
          end_date: { gte: weekStartDate },
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
          start_date: { lte: endOfWeek(now()) },
          end_date: { gte: startOfWeek(now()) },
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
        tid,
        name,
        type,
        value,
        penalty,
        start_date,
        end_date,
        comment,
      }: {
        pid: number;
        tid: number;
        name: string;
        type: TaskType;
        value: number;
        penalty: number;
        start_date: string;
        end_date: string;
        comment?: string;
      }
    ): Promise<AssignedTask> => {
      return db.assignedTask.create({
        data: {
          pid,
          tid,
          name,
          type,
          value,
          penalty,
          start_date: new Date(start_date),
          end_date: new Date(end_date),
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
        start_date?: string;
        end_date?: string;
        comment?: string;
      }
    ): Promise<AssignedTask> => {
      const updates: Partial<AssignedTask> = {};
      if (pid !== undefined) updates.pid = pid;
      if (name !== undefined) updates.name = name;
      if (type !== undefined) updates.type = type;
      if (value !== undefined) updates.value = value;
      if (penalty !== undefined) updates.penalty = penalty;
      if (start_date !== undefined) updates.start_date = new Date(start_date);
      if (end_date !== undefined) updates.end_date = new Date(end_date);
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
          const weeklyRequiredTasksNotComplete = await db.assignedTask.findMany(
            {
              where: {
                pid: assignedTask.pid,
                status: { not: TaskStatus.COMPLETE },
                start_date: { lte: endOfWeek(now()) },
                end_date: { gte: startOfWeek(now()) },
                type: TaskType.REQUIRED,
              },
            }
          );

          if (weeklyRequiredTasksNotComplete.length === 1) {
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
              start_date: { lte: endOfWeek(now()) },
              end_date: { gte: startOfWeek(now()) },
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
        } else if (assignedTask.type === TaskType.INDIVIDUAL_GOAL) {
          const individualGoalTasksNotComplete = await db.assignedTask.findMany(
            {
              where: {
                pid: assignedTask.pid,
                type: TaskType.INDIVIDUAL_GOAL,
                status: { not: TaskStatus.COMPLETE },
                start_date: { lte: endOfWeek(now()) },
                end_date: { gte: startOfWeek(now()) },
              },
            }
          );

          if (individualGoalTasksNotComplete.length === 1) {
            await updateBadgeLevelProgress(
              INDIVIDUAL_GOAL,
              assignedTask.pid,
              1
            );
          }

          await updateBadgeLevelProgress(FIRST_GOAL, assignedTask.pid, 1);
        }

        const hasPreviouslyCompleted = await db.assignedTask
          .findFirst({
            where: {
              tid: assignedTask.tid,
              status: TaskStatus.COMPLETE,
              pid: assignedTask.pid,
            },
          })
          .then((task) => task !== null);
        if (!hasPreviouslyCompleted) {
          await updateBadgeLevelProgress(
            JACK_OF_ALL_TRADES,
            assignedTask.pid,
            1
          );
        }
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
