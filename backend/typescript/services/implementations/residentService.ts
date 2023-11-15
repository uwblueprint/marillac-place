import { PrismaClient } from '@prisma/client';
import type IResidentService from "../interfaces/residentService";
import type { ResidentDTO, CreateResidentDTO, UpdateResidentDTO } from "../../services/interfaces/residentService";
import logger from "../../utilities/logger";
import { getErrorMessage } from "../../utilities/errorUtils";

const Prisma = new PrismaClient();
const Logger = logger(__filename); 


class ResidentService implements IResidentService {
    async add_resident(resident: CreateResidentDTO): Promise<ResidentDTO> {
        try {
            let newResident = await Prisma.resident.create({
              data: resident,
            });
            return newResident;
        } catch (error: unknown) {
            Logger.error(`Failed to create resident. Reason = ${getErrorMessage(error)}`);
            throw error;
        }
    }
    async update_resident(id: number, resident: UpdateResidentDTO): Promise<ResidentDTO> {
        try {
            let updatedResident = await Prisma.resident.update({
              where: {id: id},
              data: resident,
            });
            return updatedResident;
        } catch (error: unknown) {
            Logger.error(`Failed to update resident #${id}. Reason = ${getErrorMessage(error)}`);
            throw error;
        }
    }
    async delete_resident(id: number): Promise<ResidentDTO> {
        try {
            let deletedResident = await Prisma.resident.delete({
              where: {id: id}
            });
            return deletedResident;
        } catch (error: unknown) {
            Logger.error(`Failed to delete resident #${id}. Reason = ${getErrorMessage(error)}`);
            throw error;
        }
    }
    async get_all_residents(): Promise<ResidentDTO[]> {
        try {
            let allResidents = await Prisma.resident.findMany();
            return allResidents;
        } catch (error: unknown) {
            Logger.error(`Failed to get all residents. Reason = ${getErrorMessage(error)}`);
            throw error;
        }
    }
    async get_residents_by_id(id: number[]): Promise<ResidentDTO[]> {
        try {
            let allResidentsById = await Prisma.resident.findMany({
                where: {id: {in: id}}
            });
            return allResidentsById;
        } catch (error: unknown) {
            Logger.error(`Failed to get residents by IDs. IDs = ${id}. Reason = ${getErrorMessage(error)}`);
            throw error;
        }
    }

}

export default ResidentService;