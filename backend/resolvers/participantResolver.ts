import { Participant } from "@prisma/client";
import ParticipantService from "../services/implementation/participantImplementation";
import IParticipantService from "../services/interface/participantInterface";

const participantService: IParticipantService = new ParticipantService();
const participantResolver = {
  Query: {
    getCurrentParticipants: async (): Promise<Participant[]> => {
      return participantService.getCurrentParticipants();
    },
    getPastParticipants: async (): Promise<Participant[]> => {
      return participantService.getPastParticipants();
    },
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
      },
    ): Promise<boolean> => {
      return participantService.createParticipant(
        participant_id,
        room_number,
        arrival_date,
        password,
      );
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
      },
    ): Promise<boolean> => {
      return participantService.updateParticipant(
        participant_id,
        room_number,
        arrival_date,
        departure_date,
        account_creation_date,
        account_removal_date,
        marillac_bucks,
        marillac_bucks_goal,
        password,
      );
    },
  }
}

export default participantResolver;
