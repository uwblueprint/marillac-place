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
    getParticipantByRoom: async (
      _parent: undefined,
      { room_number }: { room_number: number }
    ): Promise<Participant | null> => {
      return participantService.getParticipantByRoom(room_number);
    },
    getParticipantsByRooms: async (
      _parent: undefined,
      { room_numbers }: { room_numbers: number[] }
    ): Promise<Participant[]> => {
      return participantService.getParticipantsByRooms(room_numbers);
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
      }
    ): Promise<boolean> => {
      return participantService.createParticipant(
        participant_id,
        room_number,
        arrival_date,
        password
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
      }
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
        password
      );
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
      return participantService.updateMarillacBucks(
        participant_id,
        marillac_bucks,
        reason
      );
    },
  },
};

export default participantResolver;
