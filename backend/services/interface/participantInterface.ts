import { Participant } from "@prisma/client";

interface IParticipantService {
  getPastParticipants(): Promise<Participant[]>;
  getCurrentParticipants(): Promise<Participant[]>;
  getParticipantById(participantId: string): Promise<Participant | null>;
  createParticipant(
    participantId: string,
    roomNumber: number,
    arrival: string,
    password: string,
  ): Promise<boolean>;
  updateParticipantById(
    participantId: string,
    roomNumber?: number,
    arrival?: string,
    departure?: string,
    password?: string,
  ): Promise<boolean>;
}

export default IParticipantService;
