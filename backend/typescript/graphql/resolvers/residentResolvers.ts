import ResidentService from "../../services/implementations/residentService";
import type {
  IResidentService,
  ResidentDTO,
  RedeemCreditsResponse,
  CreateResidentDTO,
  UpdateResidentDTO,
} from "../../services/interfaces/residentService";
import type {
  UpdateUserDTO,
  CreateUserDTO,
} from "../../services/interfaces/userService";

const residentService: IResidentService = new ResidentService();
// const authService: IAuthService = new AuthService(userService, emailService);

const residentResolvers = {
  Query: {
    residentsById: async (
      _parent: undefined,
      { id }: { id: string[] },
    ): Promise<Array<ResidentDTO>> => {
      return residentService.getResidentsById(id.map(Number));
    },
    allResidents: async (): Promise<Array<ResidentDTO>> => {
      return residentService.getAllResidents();
    },
    activeResidents: async (): Promise<ResidentDTO[]> => {
      const activeResidents = await residentService.getActiveResidents();
      return activeResidents;
    },
  },
  Mutation: {
    addResident: async (
      _parent: undefined,
      {
        userInfo,
        resident,
      }: {
        userInfo: CreateUserDTO;
        resident: CreateResidentDTO;
      },
    ): Promise<ResidentDTO> => {
      const newResident = await residentService.addResident(userInfo, resident);
      return newResident;
    },
    updateResident: async (
      _parent: undefined,
      {
        residentId,
        userInfo,
        resident,
      }: {
        residentId: string;
        userInfo: UpdateUserDTO;
        resident: UpdateResidentDTO;
      },
    ): Promise<ResidentDTO> => {
      const newResident = await residentService.updateResident(
        parseInt(residentId, 10),
        userInfo,
        resident,
      );
      return newResident;
    },
    deleteResident: async (
      _parent: undefined,
      { id }: { id: string },
    ): Promise<ResidentDTO> => {
      const deletedResident = await residentService.deleteResident(
        parseInt(id, 10),
      );
      return deletedResident;
    },
    redeemCredits: async (
      _parent: undefined,
      { id, credits }: { id: string; credits: number },
    ): Promise<RedeemCreditsResponse> => {
      return residentService.redeemCredits(parseInt(id, 10), credits);
    },
  },
};

export default residentResolvers;
