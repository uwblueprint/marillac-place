import { Participant } from "@prisma/client";
import { endOfDay, startOfDay } from "date-fns";
import db from "../../prisma";
import { initBadgeLevelProgress } from "../../utils/badgeUtils";
import { now } from "../../utils/dateUtils";

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
            { departure: { gt: endOfDay(now()) } },
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
            lte: startOfDay(now()),
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
      const validArrival = arrivalDate <= now();
      if (!validArrival) throw new Error("arrival is in the future");

      const occupiedRoom = await db.participant.findFirst({
        where: {
          room,
          OR: [
            { departure: null },
            { departure: { gt: endOfDay(now()) } },
          ],
        },
      });
      if (occupiedRoom) throw new Error("room is occupied");

      const participant = await db.participant.create({
        data: {
          pid,
          room,
          arrival: arrivalDate,
          password,
        },
      });
      await initBadgeLevelProgress(pid);
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
      const updates: Partial<Participant> = {};
      if (password) updates.password = password;
      if (room) updates.room = room;
      if (arrival) updates.arrival = new Date(arrival);
      if (departure) updates.departure = new Date(departure);

      const isEmpty = Object.keys(updates).length === 0;
      if (isEmpty) throw new Error("no updates received");

      return db.participant.update({
        where: { pid },
        data: updates,
      });
    },
  },
};

export default participantResolver;
