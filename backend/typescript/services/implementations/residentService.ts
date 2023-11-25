import { PrismaClient } from "@prisma/client";
import type {
  IResidentService,
  ResidentDTO,
  CreateResidentDTO,
  UpdateResidentDTO,
} from "../interfaces/residentService";
import logger from "../../utilities/logger";
import { getErrorMessage } from "../../utilities/errorUtils";

const Prisma = new PrismaClient();
const Logger = logger(__filename);

class ResidentService implements IResidentService {
  async addResident(resident: CreateResidentDTO): Promise<ResidentDTO> {
    try {
      const newResident = await Prisma.resident.create({
        data: { ...resident, credits: resident.credits ?? 0 },
      });
      return newResident;
    } catch (error: unknown) {
      Logger.error(
        `Failed to create resident. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async updateResident(
    id: number,
    resident: UpdateResidentDTO,
  ): Promise<ResidentDTO> {
    try {
      const updatedResident = await Prisma.resident.update({
        where: { id },
        data: resident,
      });
      return updatedResident;
    } catch (error: unknown) {
      Logger.error(
        `Failed to update resident #${id}. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async deleteResident(id: number): Promise<ResidentDTO> {
    try {
      const deletedResident = await Prisma.resident.delete({
        where: { id },
      });
      return deletedResident;
    } catch (error: unknown) {
      Logger.error(
        `Failed to delete resident #${id}. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async getAllResidents(): Promise<ResidentDTO[]> {
    try {
      const allResidents = await Prisma.resident.findMany({
        include: { notifications: true },
      });
      return allResidents;
    } catch (error: unknown) {
      Logger.error(
        `Failed to get all residents. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async getResidentsById(id: number[]): Promise<ResidentDTO[]> {
    try {
      const allResidentsById = await Prisma.resident.findMany({
        where: { id: { in: id } },
        include: { notifications: true },
      });
      return allResidentsById;
    } catch (error: unknown) {
      Logger.error(
        `Failed to get residents by IDs. IDs = ${id}. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }

  async getActiveResidents(): Promise<ResidentDTO[]> {
    try {
      const residents = await Prisma.resident.findMany({
        where: {
          dateLeft: null,
        },
        include: { notifications: true },
      });

      if (!residents) throw new Error(`No residents found.`);

      return residents;
    } catch (error) {
      Logger.error(
        `Failed to get all active Residents. Readon = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }
}

export default ResidentService;
