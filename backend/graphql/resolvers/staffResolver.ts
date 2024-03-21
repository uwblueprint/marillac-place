import StaffService from "../../services/implementations/staffService";
import IStaffService, {
  StaffDTO,
  CreateStaffDTO,
  UpdateStaffDTO,
} from "../../services/interfaces/staffService";

const staffService: IStaffService = new StaffService();

const staffResolvers = {
  Query: {
    getStaffByIds: async (
      _parent: undefined,
      { userIds }: { userIds: string[] },
    ): Promise<Array<StaffDTO>> => {
      return staffService.getStaffByIds(userIds.map(Number));
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
      {
        userId,
        staff,
      }: {
        userId: string;
        staff: UpdateStaffDTO;
      },
    ): Promise<StaffDTO> => {
      const newStaff = await staffService.updateStaff(
        parseInt(userId, 10),
        staff,
      );
      return newStaff;
    },
    deleteStaff: async (
      _parent: undefined,
      { userId }: { userId: string },
    ): Promise<StaffDTO> => {
      const deletedStaff = await staffService.deleteStaff(parseInt(userId, 10));
      return deletedStaff;
    },
  },
};

export default staffResolvers;
