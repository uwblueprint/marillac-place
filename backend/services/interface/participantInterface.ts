import { Participant } from "@prisma/client";

interface IParticipantService {
  getPastParticipants(): Promise<Participant[]>;
  getCurrentParticipants(): Promise<Participant[]>;
  getParticipantByRoom(room_number: number): Promise<Participant | null>;
  getParticipantsByRooms(
    room_numbers: number[]
  ): Promise<Participant[]>;
  getParticipantById(participantId: number): Promise<Participant | null>;
  createParticipant(
    participant_id: number,
    room_number: number,
    arrival_date: string,
    password: string
  ): Promise<boolean>;
  updateParticipant(
    participant_id: number,
    room_number?: number,
    arrival_date?: string,
    departure_date?: string,
    account_creation_date?: string,
    account_removal_date?: string,
    marillac_bucks?: number,
    marillac_bucks_goal?: number,
    password?: string
  ): Promise<boolean>;
  updateMarillacBucks(
    participant_id: number,
    marillac_bucks: number,
    reason: string
  ): Promise<boolean>;
  // updateParticipantById(
  //   participantId: string,
  //   roomNumber?: number,
  //   arrival?: string,
  //   departure?: string,
  //   password?: string
  // ): Promise<boolean>;
  //     getParticipantByRoom(roomNumber: number): Promise<Participant | null>;
  //     updateParticipantCredit(
  //         participantId: string,
  //         credit: number,
  //     ): Promise<boolean>;
}

export default IParticipantService;
