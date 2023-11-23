import { PrismaClient } from '@prisma/client';
import type IResidentService from "../interfaces/residentService";
import type { ResidentDTO, CreateResidentDTO, UpdateResidentDTO } from "../../services/interfaces/residentService";
import logger from "../../utilities/logger";

const Prisma = new PrismaClient();
//TODO: do logging
//const Logger = logger(__filename); 

class ResidentService implements IResidentService {
    async add_resident(resident: CreateResidentDTO): Promise<ResidentDTO> {
        try {
            let newResident = await Prisma.resident.create({
              data: {
                first_name: resident.first_name,
                last_name: resident.last_name,
                email: resident.email,
                phone_number: resident.phone_number,
                display_name: resident.display_name,
                profile_picture_link: resident.profile_picture_link,
                birthdate: resident.birthdate,
                credits: resident.credits,
                date_joined: resident.date_joined
              },
              include: { notifications: true }
            });
            return newResident;
        } catch (error: unknown) {
            //log it
            throw error;
        }
    }
    async update_resident(id: number, resident: UpdateResidentDTO): Promise<ResidentDTO> {
        try {
            let updatedResident = await Prisma.resident.update({
              where: {id: id},
              data: resident,
              include: { notifications: true }
            });
            return updatedResident;
        } catch (error: unknown) {
            //log it
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
            //log it
            throw error;
        }
    }
    async get_all_residents(): Promise<ResidentDTO[]> {
        try {
            let allResidents = await Prisma.resident.findMany({
                include: { notifications: true }
            });
            return allResidents;
        } catch (error: unknown) {
            //log it
            throw error;
        }
    }
    async get_residents_by_id(id: number[]): Promise<ResidentDTO[]> {
        try {
            let allResidentsById = await Prisma.resident.findMany({
                where: {id: {in: id}},
                include: { notifications: true }
            });
            return allResidentsById;
        } catch (error: unknown) {
            //log it
            throw error;
        }
    }

    async create_resident_with_notification(email: String, notif_id: number): Promise<ResidentDTO> {
        let newResident: ResidentDTO; 
        try{
            newResident = await Prisma.resident.create({
                data: {
                    first_name: "first",
                    last_name: "last",
                    email: String(email),
                    phone_number: "1231234123",
                    display_name: "display",
                    credits: 1.0,
                    date_joined: "2011-10-05T14:48:00.000Z",
                    notifications: {
                        connect: {
                            id: 3, 
                        }, 
                    }
                },
                include: {
                    notifications: true
                }
            })

            return newResident;

        }catch(error){
            throw error;
        }
    }
}

export default ResidentService;