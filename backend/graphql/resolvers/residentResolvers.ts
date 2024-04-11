import ResidentService from "../../services/implementations/residentService";
import IResidentService, {
  ResidentDTO,
  CreateResidentDTO,
  UpdateResidentDTO,
  RedeemCreditsResponse,
} from "../../services/interfaces/residentService";

const residentService: IResidentService = new ResidentService();

const residentResolvers = {
  Query: {
    getResidentsByIds: async (
      _parent: undefined,
      { userIds }: { userIds: string[] },
    ): Promise<Array<ResidentDTO>> => {
      return residentService.getResidentsByIds(userIds.map(Number));
    },
    getAllResidents: async (): Promise<Array<ResidentDTO>> => {
      return residentService.getAllResidents();
    },
    getActiveResidents: async (): Promise<ResidentDTO[]> => {
      const activeResidents = await residentService.getActiveResidents();
      return activeResidents;
    },
  },
  Mutation: {
    addResident: async (
      _parent: undefined,
      {
        resident,
      }: {
        resident: CreateResidentDTO;
      },
    ): Promise<ResidentDTO> => {
      const newResident = await residentService.addResident(resident);
      return newResident;
    },
    updateResident: async (
      _parent: undefined,
      {
        userId,
        resident,
      }: {
        userId: string;
        resident: UpdateResidentDTO;
      },
    ): Promise<ResidentDTO> => {
      const newResident = await residentService.updateResident(
        parseInt(userId, 10),
        resident,
      );
      return newResident;
    },
    deleteResident: async (
      _parent: undefined,
      { userId }: { userId: string },
    ): Promise<ResidentDTO> => {
      const deletedResident = await residentService.deleteResident(
        parseInt(userId, 10),
      );
      return deletedResident;
    },
    redeemCredits: async (
      _parent: undefined,
      { userId, credits }: { userId: string; credits: number },
    ): Promise<RedeemCreditsResponse> => {
      return residentService.redeemCredits(parseInt(userId, 10), credits);
    },
  },
};

export default residentResolvers;
