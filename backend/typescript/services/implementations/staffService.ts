import { PrismaClient } from "@prisma/client";
import type {
  IStaffService,
  StaffDTO,
  CreateStaffDTO,
  UpdateStaffDTO,
} from "../interfaces/staffService";
import logger from "../../utilities/logger";
import { getErrorMessage } from "../../utilities/errorUtils";

const Prisma = new PrismaClient();
const Logger = logger(__filename);
/*
class StaffService implements IStaffService {
  async addStaff(staff: CreateStaffDTO): Promise<StaffDTO> {
    try {
      const newStaff = await Prisma.staff.create({
        data: { ...staff },
      });
      return newStaff;
    } catch (error) {
      Logger.error(`Failed to create staff because ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async updateStaff(id: number, staffInfo: UpdateStaffDTO): Promise<StaffDTO> {
    try {
      const updatedStaff = await Prisma.staff.update({
        where: { id },
        data: staffInfo,
      });
      return updatedStaff;
    } catch (error) {
      Logger.error(
        `Failed to update staff #${id} because ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async deleteStaff(id: number): Promise<StaffDTO> {
    try {
      const deletedStaff = await Prisma.staff.delete({
        where: { id },
      });
      return deletedStaff;
    } catch (error) {
      Logger.error(
        `Failed to delete staff #${id} because ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async getAllStaff(): Promise<Array<StaffDTO>> {
    try {
      const allStaff = await Prisma.staff.findMany();
      return allStaff;
    } catch (error: unknown) {
      Logger.error(`Failed to get all Staff because ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async getStaffById(id: number[]): Promise<Array<StaffDTO>> {
    try {
      const getStaffById = await Prisma.staff.findMany({
        where: { id: { in: id } },
        include: {
          notifications: true,
        },
      });
      return getStaffById;
    } catch (error: unknown) {
      Logger.error(
        `Failed to get staff by IDs. IDs = ${id} because ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }
}

export default StaffService;
*/