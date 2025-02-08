import prisma from "../../prisma";
import { Participant } from "@prisma/client";
import IParticipantService from "../interface/participantInterface";

class ParticipantService implements IParticipantService {
  async getAllParticipants(): Promise<Participant[]> {
    try {
      const participants = await prisma.participant.findMany({
        orderBy: [
          { departure: "asc" },
          { arrival: "desc" }
        ]
      });
      return participants;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async getParticipantById(participantId: string): Promise<Participant | null> {
    try {
      const participant: Participant | null = await prisma.participant.findUnique({
        where: {
          participantId: participantId
        }
      });
      return participant;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async createParticipant(participantId: string, roomNumber: number, arrival: string, password: string): Promise<boolean> {
    try {
      await prisma.participant.create({
        data: {
          participantId,
          roomNumber,
          arrival,
          password
        },
      });
      return true;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}

export default ParticipantService;
