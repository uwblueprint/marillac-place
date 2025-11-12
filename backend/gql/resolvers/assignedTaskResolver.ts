import { AssignedTask, Task, TaskStatus } from "@prisma/client";
import db from "../../prisma";
import { getToday } from "../../utils/dateUtils";

const assignedTaskResolver = {
  Query: {
    getNumberOfAssignedTasksByRoom: async (): Promise<number[]> => {
      const today = getToday();
      const currentParticipants = await db.participant.findMany({
        where: {
          OR: [
            { departure: null },
            { departure: { gt: today } },
          ],
        },
        select: {
          pid: true,
          room: true,
        },
      });

      const currentPids = currentParticipants.map(p => p.pid);
      const pidToRoom = new Map(currentParticipants.map(p => [p.pid, p.room]));

      if (currentParticipants.length === 0) return Array(10).fill(0);

      const assignedTaskCounts = await db.assignedTask.groupBy({
        by: ['pid'],
        where: {
          pid: { in: currentPids },
          status: TaskStatus.ASSIGNED,
        },
        _count: { tid: true },
      });

      const counts = Array(10).fill(0);
      for (const { pid, _count } of assignedTaskCounts) {
        const room = pidToRoom.get(pid);
        if (room === undefined) continue;
        counts[room - 1] += _count.tid;
      }
      return counts;
    },
    getAssignedTasksForToday: async (
      _parent: undefined,
      { pid }: { 
        pid: number 
      }
    ): Promise<AssignedTask[]> => {
      const startOfDay = getToday();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999)

      return await db.assignedTask.findMany({
        where: {
          pid,
          start_date: { lte: endOfDay },
          end_date: { gte: startOfDay },
        },
        include: { task: true }
      });
    },
    getAssignedTasksByWeek: async (
      _parent: undefined,
      { pid, weekStart }: {
        pid: number;
        weekStart: Date;
      }
    ): Promise<AssignedTask[]> => {
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      return await db.assignedTask.findMany({
        where: {
          pid,
          start_date: { lte: weekEnd },
          end_date: { gte: weekStart },
        },
        include: { task: true }
      });
    },
  },
  Mutation: {
    createAssignedTask: async (
      _parent: undefined,
      {
        tid,
        pid,
        value,
        penalty,
        start_date,
        end_date,
        comment,
      }: {
        tid: number;
        pid: number;
        value: number;
        penalty: number;
        start_date: Date;
        end_date: Date;
        comment?: string;
      }
    ): Promise<AssignedTask> => {
      return await db.assignedTask.create({
        data: { tid, pid, value, penalty, start_date, end_date, comment },
      });
    },
    updateAssignedTask: async (
      _parent: undefined,
      {
        tid,
        pid,
        value,
        penalty,
        start_date,
        end_date,
        comment,
      }: {
        tid: number;
        pid: number;
        value?: number;
        penalty?: number;
        start_date?: Date;
        end_date?: Date;
        comment?: string;
      }
    ): Promise<AssignedTask> => {
      const updates: any = {};
      if (value) updates.value = value;
      if (penalty) updates.penalty = penalty;
      if (start_date) updates.start_date = start_date;
      if (end_date) updates.end_date = end_date;
      if (comment) updates.comment = comment;

      const isEmpty = Object.keys(updates).length === 0;
      if (isEmpty) throw new Error("no updates received");

      return await db.assignedTask.update({
        where: { tid_pid: { tid, pid } },
        data: updates,
      });
    },
    updateAssignedTaskStatus: async (
      _parent: undefined,
      {
        tid,
        pid,
        status
      }: {
        tid: number;
        pid: number;
        status: TaskStatus;
      }
    ): Promise<AssignedTask> => {
      if (status === TaskStatus.ASSIGNED) {
        throw new Error("invalid status update")
      }

      if (status === TaskStatus.COMPLETE) {
        // get task object
        // process earning
        // perfect score, jack of all trades, first goal, individual goal badge logic goes here
      }
      
      return await db.assignedTask.update({
        where: { tid_pid: { tid, pid } },
        data: { status },
      });
    },
    deleteAssignedTask: async (
      _parent: undefined,
      { pid, tid }: { 
        pid: number;
        tid: number;
      }
    ): Promise<AssignedTask> => {
      return await db.assignedTask.delete({
        where: { tid_pid: { tid, pid } },
      });
    },
  },
};

export default assignedTaskResolver;















