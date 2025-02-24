import { Participant } from "@prisma/client";
import ParticipantService from "../../services/implementation/participantImplementation";
import IParticipantService from "../../services/interface/participantInterface";

const participantService: IParticipantService = new ParticipantService();
const participantResolvers = {
  Query: {
    getAllParticipants: async (): Promise<Participant[]> => {
      return participantService.getAllParticipants();
    },
    getParticipantById: async (
      _parent: undefined,
      { participantId }: { participantId: string },
    ): Promise<Participant | null> => {
      return participantService.getParticipantById(participantId);
    },
  },
  Mutation: {
    createParticipant: async (
      _parent: undefined,
      {
        participantId,
        roomNumber,
        arrival,
        password,
      }: {
        participantId: string;
        roomNumber: number;
        arrival: string;
        password: string;
      },
    ): Promise<boolean> => {
      return participantService.createParticipant(
        participantId,
        roomNumber,
        arrival,
        password,
      );
    },
    updateParticipantById: async (
      _parent: undefined,
      {
        participantId,
        roomNumber,
        arrival,
        departure,
        password,
      }: {
        participantId: string;
        roomNumber: number;
        arrival: string;
        departure: string;
        password: string;
      },
    ): Promise<boolean> => {
      return participantService.updateParticipantById(
        participantId,
        roomNumber,
        arrival,
        departure,
        password,
      );
    },
  },
};

export default participantResolvers;

// import IResidentService, {
//   ResidentDTO,
//   CreateResidentDTO,
//   UpdateResidentDTO,
//   RedeemCreditsResponse,
// } from "../../services/interface/residentService";

// const residentResolvers = {
//   Query: {
//     getResidentsByIds: async (
//       _parent: undefined,
//       { userIds }: { userIds: string[] },
//     ): Promise<Array<ResidentDTO>> => {
//       return residentService.getResidentsByIds(userIds.map(Number));
//     },
//     getAllResidents: async (): Promise<Array<ResidentDTO>> => {
//       return residentService.getAllResidents();
//     },
//     getActiveResidents: async (): Promise<ResidentDTO[]> => {
//       const activeResidents = await residentService.getActiveResidents();
//       return activeResidents;
//     },
//   },
//   Mutation: {
//     addResident: async (
//       _parent: undefined,
//       {
//         resident,
//       }: {
//         resident: CreateResidentDTO;
//       },
//     ): Promise<ResidentDTO> => {
//       const newResident = await residentService.addResident(resident);
//       return newResident;
//     },
//     updateResident: async (
//       _parent: undefined,
//       {
//         userId,
//         resident,
//       }: {
//         userId: string;
//         resident: UpdateResidentDTO;
//       },
//     ): Promise<ResidentDTO> => {
//       const newResident = await residentService.updateResident(
//         parseInt(userId, 10),
//         resident,
//       );
//       return newResident;
//     },
//     deleteResident: async (
//       _parent: undefined,
//       { userId }: { userId: string },
//     ): Promise<ResidentDTO> => {
//       const deletedResident = await residentService.deleteResident(
//         parseInt(userId, 10),
//       );
//       return deletedResident;
//     },
//     redeemCredits: async (
//       _parent: undefined,
//       { userId, credits }: { userId: string; credits: number },
//     ): Promise<RedeemCreditsResponse> => {
//       return residentService.redeemCredits(parseInt(userId, 10), credits);
//     },
//   },
// };
