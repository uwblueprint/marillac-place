import { Participant } from "@prisma/client";

interface IParticipantService {
  getAllParticipants(): Promise<Participant[]>;
  getParticipantById(participantId: string): Promise<Participant | null>;
  createParticipant(participantId: string, roomNumber: number, arrival: string, password: string): Promise<boolean>;
}

export default IParticipantService;
