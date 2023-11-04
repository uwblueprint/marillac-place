import { Prisma } from "@prisma/client";
import AdminService from "../../services/implementations/adminService";
import {IAdminService} from "../../services/interfaces/adminService";

// change staff_id to StaffService when its done 
const adminService: IAdminService = new AdminService(); 

const adminResolvers = { 
    Query: {
        notificationById: async (
            _parent: undefined,
            { id }: { id: number},
        ): Promise<Prisma.notificationCreateInput> => {
            return await adminService.getNotificationById(id);
        },
        activeResidents: async (
            _parent: undefined,
        ): Promise<Prisma.residentUncheckedCreateInput[]> => {
            const activeResidents = await adminService.getActiveResidents();
            return activeResidents;
        }
    },

    Mutations: {
        sendNotification: async (
            _parent: undefined,
            {message, resident_id}: {message: String; resident_id: number},
        ): Promise<void> => {
            const newNotification = await adminService.sendNotification(message, resident_id)
        },
        sendAnnouncement: async ( 
            _parent: undefined,
            {message}: {message: String},
        ): Promise<void> => {
            const newAnnouncement = await adminService.sendAnnouncement(message)
        }
    }
}