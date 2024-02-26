import StaffService from "../../services/implementations/staffService";
import type {
  IStaffService,
  StaffDTO,
} from "../../services/interfaces/staffService";
import type {
  UpdateUserDTO,
  CreateUserDTO,
} from "../../services/interfaces/userService";

const staffService: IStaffService = new StaffService();

const staffResolvers = {
  Query: {
    getStaffByIds: async (
      _parent: undefined,
      { staffIds }: { staffIds: string[] },
    ): Promise<Array<StaffDTO>> => {
      return staffService.getStaffByIds(staffIds.map(Number));
    },
    getAllStaff: async (): Promise<Array<StaffDTO>> => {
      return staffService.getAllStaff();
    },
  },
  Mutation: {
    addStaff: async (
      _parent: undefined,
      { userInfo, isAdmin }: { userInfo: CreateUserDTO, isAdmin: boolean},
    ): Promise<StaffDTO> => {
      const newStaff = await staffService.addStaff(userInfo, isAdmin);
      return newStaff;
    },
    updateStaff: async (
      _parent: undefined,
      { staffId, staff, isAdmin }: { staffId: string; staff: UpdateUserDTO, isAdmin: boolean | undefined },
    ): Promise<StaffDTO> => {
      const newStaff = await staffService.updateStaff(parseInt(staffId, 10), staff, isAdmin);
      return newStaff;
    },
    deleteStaff: async (
      _parent: undefined,
      { staffId }: { staffId: string },
    ): Promise<StaffDTO> => {
      const deletedStaff = await staffService.deleteStaff(parseInt(staffId, 10));
      return deletedStaff;
    },
  },
};

export default staffResolvers;
