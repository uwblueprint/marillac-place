import { AssignedTask, TaskStatus, TaskType } from "@prisma/client";
import { startOfWeek, endOfWeek } from "date-fns";
import db from "../../prisma";
import { getBeginningOfWeek, getToday } from "../../utils/dateUtils";
import processEarning from "../../utils/transactionUtils";
import { updateBadgeLevelProgress } from "../../utils/badgeUtils";

const assignedTaskResolver = {
  Query: {
    getNumberOfAssignedTasksByRoom: async (): Promise<number[]> => {
      const today = getToday();
      const currentParticipants = await db.participant.findMany({
        where: {
          OR: [{ departure: null }, { departure: { gt: today } }],
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
      const startOfDay = getToday();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      return db.assignedTask.findMany({
        where: {
          pid,
          start_date: { lte: endOfDay },
          end_date: { gte: startOfDay },
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
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      return db.assignedTask.findMany({
        where: {
          pid,
          start_date: { lte: weekEnd },
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
      const weekStart = getBeginningOfWeek();
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      const requiredTasksNotComplete = await db.assignedTask.findMany({
        where: {
          pid,
          type: TaskType.REQUIRED,
          status: { not: TaskStatus.COMPLETE },
          start_date: { lte: weekEnd },
          end_date: { gte: weekStart },
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
      }

      // query the database and get the task object corresponding to the aid
      const assignedTask = await db.assignedTask.findUnique({
        where: { assigned_task_id: aid },
      });

      if (assignedTask === null) {
        throw new Error("assigned task not found");
      }

      if (status === TaskStatus.COMPLETE) {
        // get how many marillac bucks the task is worth and call the process earning function with the reason being a task was completed
        await processEarning(
          assignedTask.participant_id,
          assignedTask.marillac_bucks_addition,
          `Completed task: ${assignedTask.goal_name}`
        );

        const today = new Date();
        const weekStart = startOfWeek(today);
        const weekEnd = endOfWeek(today);

        // execute perfect score required logic (check that all required tasks for this week have been completed)
        if (assignedTask.task_type === TaskType.REQUIRED) {
          const weeklyRequiredTasks = await db.assignedTask.findMany({
            where: {
              participant_id: assignedTask.participant_id,
              start_date: { lte: weekEnd },
              end_date: { gte: weekStart },
              task_type: TaskType.REQUIRED,
            },
          });

          if (
            weeklyRequiredTasks.length > 0 &&
            weeklyRequiredTasks.every(
              (task) => task.task_status === TaskStatus.COMPLETE
            )
          ) {
            // call updateBadgeLevelProgress function in the utils for the perfect score required
            await updateBadgeLevelProgress(
              "Perfect Score Badge for Required Tasks",
              assignedTask.participant_id,
              1
            );
          }
        }
        // execute perfect score optional logic (check that 3+ optional tasks from this week have been completed)
        else if (assignedTask.task_type === TaskType.OPTIONAL) {
          const numOfWeeklyCompletedOptionalTasks = await db.assignedTask.count(
            {
              where: {
                participant_id: assignedTask.participant_id,
                start_date: { lte: weekEnd },
                end_date: { gte: weekStart },
                task_type: TaskType.OPTIONAL,
                task_status: TaskStatus.COMPLETE,
              },
            }
          );

          if (numOfWeeklyCompletedOptionalTasks === 2) {
            // call updateBadgeLevelProgress function in the utils for optional badges
            await updateBadgeLevelProgress(
              "Perfect Score Badge for Optional Tasks",
              assignedTask.participant_id,
              1
            );
          }
        }

        // TODO: add jack of all trades, first goal, individual goal badge logic
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
