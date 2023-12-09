import StaffService from "../../services/implementations/staffService";
import type {
  IStaffService,
  StaffDTO,
  CreateStaffDTO,
  UpdateStaffDTO,
} from "../../services/interfaces/staffService";

const staffService: IStaffService = new StaffService();

const staffResolvers = {
  Query: {
    getStaffById: async (
      _parent: undefined,
      { id }: { id: string[] },
    ): Promise<Array<StaffDTO>> => {
      return staffService.getStaffById(id.map(Number));
    },
    getAllStaff: async (): Promise<Array<StaffDTO>> => {
      return staffService.getAllStaff();
    },
  },
  Mutation: {
    addStaff: async (
      _parent: undefined,
      { staff }: { staff: CreateStaffDTO },
    ): Promise<StaffDTO> => {
      const newStaff = await staffService.addStaff(staff);
      return newStaff;
    },
    updateStaff: async (
      _parent: undefined,
      { id, staff }: { id: string; staff: UpdateStaffDTO },
    ): Promise<StaffDTO> => {
      const newStaff = await staffService.updateStaff(parseInt(id, 10), staff);
      return newStaff;
    },
    deleteStaff: async (
      _parent: undefined,
      { id }: { id: string },
    ): Promise<StaffDTO> => {
      const deletedStaff = await staffService.deleteStaff(parseInt(id, 10));
      return deletedStaff;
    },
  },
};

export default staffResolvers;
