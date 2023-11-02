import { PrismaClient } from '@prisma/client';
import type IResidentService from "../interfaces/residentService";
import type { ResidentDTO, CreateResidentDTO, UpdateResidentDTO } from "../../services/interfaces/residentService";
import logger from "../../utilities/logger";

const Prisma = new PrismaClient();
//TODO: do logging
//const Logger = logger(__filename); 

class ResidentService implements IResidentService {
    async add_resident(residentInfo: CreateResidentDTO): Promise<ResidentDTO> {
        try {
            let newResident = await Prisma.resident.create({
              data: residentInfo,
            });
            return newResident;
        } catch (error: unknown) {
            //log it
            throw error;
        }
    }
    async update_resident(residentId: number, residentInfo: UpdateResidentDTO): Promise<ResidentDTO> {
        try {
            let updatedResident = await Prisma.resident.update({
              where: {id: residentId},
              data: residentInfo,
            });
            return updatedResident;
        } catch (error: unknown) {
            //log it
            throw error;
        }
    }
    async delete_resident(residentId: number): Promise<ResidentDTO> {
        try {
            let deletedResident = await Prisma.resident.delete({
              where: {id: residentId}
            });
            return deletedResident;
        } catch (error: unknown) {
            //log it
            throw error;
        }
    }
    async get_all_residents(): Promise<ResidentDTO[]> {
        try {
            let allResidents = await Prisma.resident.findMany();
            return allResidents;
        } catch (error: unknown) {
            //log it
            throw error;
        }
    }
    async get_residents_by_id(residentId: number[]): Promise<ResidentDTO[]> {
        try {
            let allResidentsById = await Prisma.resident.findMany({
                where: {id: {in: residentId}}
            });
            return allResidentsById;
        } catch (error: unknown) {
            //log it
            throw error;
        }
    }

}

export default ResidentService;