import { Participant } from "@prisma/client";
import db from "../../prisma";
import { getToday } from "../../utils/dateUtils";
import { initBadgeLevelProgress } from "../../utils/badgeUtils";

const participantResolver = {
  Query: {
    // TODO: write query that gets participant by pid
    getCurrentParticipants: async (): Promise<Participant[]> => {
      const today = getToday();
      return db.participant.findMany({
        where: {
          OR: [{ departure: null }, { departure: { gt: today } }],
        },
        orderBy: [{ room: "asc" }],
      });
    },
    getPastParticipants: async (): Promise<Participant[]> => {
      const today = getToday();
      return db.participant.findMany({
        where: {
          departure: {
            not: null,
            lte: today,
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
        arrival: Date;
      }
    ): Promise<Participant> => {
      const existingParticipant = await db.participant.findUnique({
        where: { pid },
      });
      if (existingParticipant) throw new Error("participant id already exists");

      const today = getToday();
      const validArrival = arrival <= today;
      if (!validArrival) throw new Error("arrival is in the future");

      const occupiedRoom = await db.participant.findFirst({
        where: {
          room,
          OR: [{ departure: null }, { departure: { gt: today } }],
        },
      });
      if (occupiedRoom) throw new Error("room is occupied");

      const participant = await db.participant.create({
        data: {
          pid,
          room,
          arrival,
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
        arrival?: Date;
        departure?: Date;
      }
    ): Promise<Participant> => {
      const updates: Partial<Participant> = {};
      if (password) updates.password = password;
      if (room) updates.room = room;
      if (arrival) updates.arrival = arrival;
      if (departure) updates.departure = departure;

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
