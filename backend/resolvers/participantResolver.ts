import { Participant, Prisma, PrismaClient } from "@prisma/client";
import { getToday } from "../utils/formatDateTime";

const prisma = new PrismaClient();

const participantResolver = {
  Query: {
    getCurrentParticipants: async (): Promise<Participant[]> => {
      const participants = await prisma.participant.findMany({
        where: {
          OR: [{ departure_date: null }, { departure_date: { gt: getToday() } }],
        },
        orderBy: [{ room_number: "asc" }],
      });
      return participants;
    },
    getPastParticipants: async (): Promise<Participant[]> => {
      const participants = await prisma.participant.findMany({
        where: {
          departure_date: {
            not: null,
            lte: getToday(),
          },
        },
        orderBy: [{ departure_date: "desc" }],
      });
      return participants;
    },
    getParticipantByRoom: async (
      _parent: undefined,
      { room_number }: { room_number: number }
    ): Promise<Participant | null> => {
      return await prisma.participant.findFirst({
        where: {
          AND: [
            { room_number },
            {
              OR: [{ departure_date: null }, { departure_date: { gt: getToday() } }],
            },
          ],
        },
        include: {
          assigned_tasks: true,
        },
      });
    },
    getParticipantsByRooms: async (
      _parent: undefined,
      { room_numbers }: { room_numbers: number[] }
    ): Promise<Participant[]> => {
      return await prisma.participant.findMany({
        where: {
          AND: [
            { room_number: { in: room_numbers } },
            {
              OR: [{ departure_date: null }, { departure_date: { gt: getToday() } }],
            },
          ],
        },
      });
    },
    getParticipantById: async (
      _parent: undefined,
      { participantId }: { participantId: number }
    ): Promise<Participant | null> => {
      return await prisma.participant.findUnique(
              {
                  where: {
                      participant_id: participantId,
                  },
              },
          );
    },
    getMarillacBucksGoalByParticipantId: async (
      _parent: undefined,
      { participantId } : { participantId: number }
    ): Promise<number> => {
      const participant = await prisma.participant.findUnique({
        where: { participant_id: participantId },
        select: { marillac_bucks_goal: true },
      });
      
      return participant?.marillac_bucks_goal ?? 0;
    }
  },
  Mutation: {
    createParticipant: async (
      _parent: undefined,
      {
        participant_id,
        room_number,
        arrival_date,
        password,
      }: {
        participant_id: number;
        room_number: number;
        arrival_date: string;
        password: string;
      }
    ): Promise<boolean> => {
      let existingParticipant: Participant | null = null;
   
      existingParticipant = await prisma.participant.findUnique({
        where: { participant_id },
      });

      let occupiedRoom: Participant | null = null;

      occupiedRoom = await prisma.participant.findFirst({
        where: {
          room_number,
          OR: [{ departure_date: null }, { departure_date: { gte: getToday() } }],
        },
      });

      await prisma.participant.create({
        data: {
          participant_id,
          room_number,
          arrival_date,
          password,
          account_creation_date: getToday(),
        },
      });
      return true;
    },
    updateParticipant: async (
      _parent: undefined,
      {
        participant_id,
        room_number,
        arrival_date,
        departure_date,
        account_creation_date,
        account_removal_date,
        marillac_bucks,
        marillac_bucks_goal,
        password,
      }: {
        participant_id: number;
        room_number?: number;
        arrival_date?: string;
        departure_date?: string;
        account_creation_date?: string;
        account_removal_date?: string;
        marillac_bucks?: number;
        marillac_bucks_goal?: number;
        password?: string;
      }
    ): Promise<boolean> => {
      const updatedData: Record<string, any> = {};
      if (room_number) updatedData.room_number = room_number;
      if (arrival_date) updatedData.arrival_date = arrival_date;
      if (departure_date) updatedData.departure_date = departure_date;
      if (account_creation_date)
        updatedData.account_creation_date = account_creation_date;
      if (account_removal_date)
        updatedData.account_removal_date = account_removal_date;
      if (marillac_bucks) updatedData.marillac_bucks = marillac_bucks;
      if (marillac_bucks_goal)
        updatedData.marillac_bucks_goal = marillac_bucks_goal;
      if (password) updatedData.password = password;

      await prisma.participant.update({
        where: { participant_id },
        data: updatedData,
      })

      return true;
    },
    updateMarillacBucks: async (
      _parent: undefined,
      {
        participant_id,
        marillac_bucks,
        reason,
      }: {
        participant_id: number;
        marillac_bucks: number;
        reason: string;
      }
    ): Promise<boolean> => {
      await prisma.participant.update({
        where: { participant_id },
        data: { marillac_bucks },
      });
      return true;
    },
  },
};

export default participantResolver;
