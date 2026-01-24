import { Participant, TaskType } from "@prisma/client";
import db from "../../prisma";
import { initBadgeLevelProgress } from "../../utils/badgeUtils";
import { getEndOfDay } from "../../utils/dateUtils";
import { assignTasksToParticipants } from "../../utils/taskUtils";

const participantResolver = {
  Query: {
    getParticipantByPid: async (
      _parent: undefined,
      { pid }: { pid: number }
    ): Promise<Participant> => {
      const participant = await db.participant.findUnique({
        where: { pid },
      });
      if (!participant) throw new Error("participant not found");
      return participant;
    },
    getCurrentParticipants: async (): Promise<Participant[]> => {
      return db.participant.findMany({
        where: {
          OR: [
            { departure: null },
            { departure: { gt: getEndOfDay(new Date()) } },
          ],
        },
        orderBy: [{ room: "asc" }],
      });
    },
    getPastParticipants: async (): Promise<Participant[]> => {
      return db.participant.findMany({
        where: {
          departure: {
            not: null,
            lte: getEndOfDay(new Date()),
          },
        },
        orderBy: [{ departure: "desc" }],
      });
    },
  },
  Mutation: {
    createParticipant: async (
      _parent: undefined,
      {
        pid,
        password,
        room,
        arrival,
      }: {
        pid: number;
        password: string;
        room: number;
        arrival: string;
      }
    ): Promise<Participant> => {
      const existingParticipant = await db.participant.findUnique({
        where: { pid },
      });
      if (existingParticipant) throw new Error("participant id already exists");

      const arrivalDate = new Date(arrival);
      const validArrival = arrivalDate <= new Date();
      if (!validArrival) throw new Error("arrival is in the future");

      if (room < 1 || room > 10) {
        throw new Error("room must be between 1 and 10");
      }

      const occupiedRoom = await db.participant.findFirst({
        where: {
          room,
          OR: [
            { departure: null },
            { departure: { gt: getEndOfDay(new Date()) } },
          ],
        },
      });
      if (occupiedRoom) throw new Error("room is occupied");

      const participant = await db.participant.create({
        data: {
          pid,
          room,
          password,
          arrival: arrivalDate,
        },
      });
      await initBadgeLevelProgress(pid);

      const requiredTasks = await db.task.findMany({
        where: { type: TaskType.REQUIRED },
      });
      await assignTasksToParticipants(requiredTasks, [pid]);
      return participant;
    },
    updateParticipant: async (
      _parent: undefined,
      {
        pid,
        password,
        room,
        arrival,
        departure,
      }: {
        pid: number;
        password?: string;
        room?: number;
        arrival?: string;
        departure?: string;
      }
    ): Promise<Participant> => {
      const updates: any = {};
      if (password) updates.password = password;
      if (room) updates.room = room;
      if (arrival) updates.arrival = new Date(arrival);
      if (departure) updates.departure = new Date(departure);

      const isEmpty = Object.keys(updates).length === 0;
      if (isEmpty) throw new Error("no updates received");

      if (room !== undefined && (room < 1 || room > 10)) {
        throw new Error("room must be between 1 and 10");
      }

      return db.participant.update({
        where: { pid },
        data: updates,
      });
    },
  },
};

export default participantResolver;
