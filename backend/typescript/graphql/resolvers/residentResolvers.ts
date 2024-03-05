import ResidentService from "../../services/implementations/residentService";
import type {
  IResidentService,
  ResidentDTO,
  RedeemCreditsResponse,
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
        residentId,
        birthDate,
        roomNumber,
      }: {
        userInfo: CreateUserDTO;
        residentId: number;
        birthDate: string;
        roomNumber: number;
      },
    ): Promise<ResidentDTO> => {
      const newResident = await residentService.addResident(
        userInfo,
        residentId,
        birthDate,
        roomNumber,
      );
      return newResident;
    },
    updateResident: async (
      _parent: undefined,
      {
        userInfo,
        residentId,
        birthDate,
        roomNumber,
      }: {
        userInfo: UpdateUserDTO;
        residentId: number;
        birthDate: string;
        roomNumber: number;
      },
    ): Promise<ResidentDTO> => {
      const newResident = await residentService.updateResident(
        userInfo,
        residentId,
        birthDate,
        roomNumber,
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
