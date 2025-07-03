import { Participant } from "@prisma/client";
import prisma from "../../prisma";
import IParticipantService from "../interface/participantInterface";
import { getToday } from "../../utils/formatDateTime";

class ParticipantService implements IParticipantService {
  async getPastParticipants(): Promise<Participant[]> {
    try {
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
    } catch (err) {
      throw new Error("Something went wrong");
    }
  }

  async getCurrentParticipants(): Promise<Participant[]> {
    try {
      const participants = await prisma.participant.findMany({
        where: {
          OR: [{ departure_date: null }, { departure_date: { gt: getToday() } }],
        },
        orderBy: [{ room_number: "asc" }],
      });
      return participants;
    } catch (err) {
      throw new Error("Something went wrong");
    }
  }

  async getParticipantByRoom(room_number: number): Promise<Participant | null> {
    try {
      const participant = await prisma.participant.findFirst({
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
      return participant;
    } catch (err) {
      throw new Error("Something went wrong");
    }
  }

  async getParticipantsByRooms(
    room_numbers: number[]
  ): Promise<Participant[]> {
    try {
      const participants = await prisma.participant.findMany({
        where: {
          AND: [
            { room_number: { in: room_numbers } },
            {
              OR: [{ departure_date: null }, { departure_date: { gt: getToday() } }],
            },
          ],
        },
      });
      return participants;
    } catch (err) {
      throw new Error("Something went wrong");
    }
  }

  //
  //     async getParticipantById(participantId: string): Promise<Participant | null> {
  //         try {
  //             const participant: Participant | null = await prisma.participant.findUnique(
  //                 {
  //                     where: {
  //                         participantId,
  //                     },
  //                 },
  //             );
  //             return participant;
  //         } catch (err) {
  //             console.log(err);
  //             throw err;
  //         }
  //     }
  //
  async createParticipant(
    participant_id: number,
    room_number: number,
    arrival_date: string,
    password: string
  ): Promise<boolean> {
    let existingParticipant: Participant | null = null;
    try {
      existingParticipant = await prisma.participant.findUnique({
        where: { participant_id },
      });
    } catch (err) {
      throw new Error("Something went wrong");
    }
    if (existingParticipant) {
      throw new Error("Participant already exists");
    }

    let occupiedRoom: Participant | null = null;
    try {
      occupiedRoom = await prisma.participant.findFirst({
        where: {
          room_number,
          OR: [{ departure_date: null }, { departure_date: { gte: getToday() } }],
        },
      });
    } catch (err) {
      throw new Error("Something went wrong");
    }
    if (occupiedRoom) {
      throw new Error("Room is occupied");
    }

    try {
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
    } catch (err) {
      throw new Error("Something went wrong");
    }
  }

  async updateParticipant(
    participant_id: number,
    room_number?: number,
    arrival_date?: string,
    departure_date?: string,
    account_creation_date?: string,
    account_removal_date?: string,
    marillac_bucks?: number,
    marillac_bucks_goal?: number,
    password?: string
  ): Promise<boolean> {
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

    try {
      await prisma.participant.update({
        where: { participant_id },
        data: updatedData,
      });
      return true;
    } catch (err) {
      throw new Error("Something went wrong");
    }
  }

  async updateMarillacBucks(
    participant_id: number,
    marillac_bucks: number,
    reason: string
  ): Promise<boolean> {
    try {
      await prisma.participant.update({
        where: { participant_id },
        data: { marillac_bucks },
      });
      return true;
    } catch (err) {
      throw new Error("Something went wrong");
    }
  }
  //
  //     async getParticipantByRoom(roomNumber: number): Promise<Participant | null> {
  //         try {
  //             const participant: Participant | null = await prisma.participant.findFirst(
  //                 {
  //                     where: {
  //                         roomNumber,
  //                     },
  //                 },
  //             );
  //             return participant;
  //         } catch (err) {
  //             console.log(err);
  //             throw err
  //         }
  //     }
  //
  //     async updateParticipantCredit(
  //         participantId: string,
  //         credit: number,
  //     ): Promise<boolean> {
  //         const updatedData: Record<string, any> = {};
  //         if (credit !== undefined) updatedData.credit = credit;
  //         if (!participantId) throw new Error("participantId is required");
  //         try {
  //             await prisma.participant.update({
  //                 where: { participantId },
  //                 data: updatedData,
  //             });
  //             return true;
  //         } catch (err) {
  //             console.log(err);
  //             throw err;
  //         }
  //     }
}

export default ParticipantService;
