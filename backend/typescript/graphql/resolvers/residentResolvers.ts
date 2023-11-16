import ResidentService from "../../services/implementations/residentService";
import type {
  IResidentService,
  ResidentDTO,
  CreateResidentDTO,
  UpdateResidentDTO,
} from "../../services/interfaces/residentService";

const residentService: IResidentService = new ResidentService();
// const authService: IAuthService = new AuthService(userService, emailService);

const residentResolvers = {
  Query: {
    residentsById: async (
      _parent: undefined,
      { id }: { id: string[] },
    ): Promise<Array<ResidentDTO>> => {
      return residentService.get_residents_by_id(id.map(Number));
    },
    allResidents: async (): Promise<Array<ResidentDTO>> => {
      return residentService.get_all_residents();
    },
  },
  Mutation: {
    addResident: async (
      _parent: undefined,
      { resident }: { resident: CreateResidentDTO },
    ): Promise<ResidentDTO> => {
      const newResident = await residentService.add_resident(resident);
      return newResident;
    },
    updateResident: async (
      _parent: undefined,
      { id, resident }: { id: string; resident: UpdateResidentDTO },
    ): Promise<ResidentDTO> => {
      const newResident = await residentService.update_resident(
        parseInt(id, 10),
        resident,
      );
      return newResident;
    },
    deleteResident: async (
      _parent: undefined,
      { id }: { id: string },
    ): Promise<ResidentDTO> => {
      const deletedResident = await residentService.delete_resident(
        parseInt(id, 10),
      );
      return deletedResident;
    },
  },
};

export default residentResolvers;
