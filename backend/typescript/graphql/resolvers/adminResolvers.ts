import { Prisma } from "@prisma/client"
import AdminService from "../../services/implementations/adminService"
import {IAdminService} from "../../services/interfaces/adminService"

// change staff_id to StaffService when its done 
const adminService: IAdminService = new AdminService()

const adminResolvers = { 
    Query: {
        notificationById: async (
            _parent: undefined,
            { id }: { id: number},
        ): Promise<Prisma.notificationCreateInput> => {
            return await adminService.getNotificationById(id)
        },
        activeResidents: async (
            _parent: undefined,
        ): Promise<Prisma.residentUncheckedCreateInput[]> => {
            const activeResidents = await adminService.getActiveResidents()
            return activeResidents
        }
    },

    Mutations: {
        sendNotification: async (
            _parent: undefined,
            {message, resident_id}: {message: String; resident_id: number},
        ): Promise<Prisma.notificationCreateInput> => {
            const newNotification = await adminService.sendNotification(message, resident_id)
            return newNotification
        },
        sendAnnouncement: async ( 
            _parent: undefined,
            {message}: {message: String},
        ): Promise<Prisma.notificationCreateInput> => {
            const newAnnouncement = await adminService.sendAnnouncement(message);
            return newAnnouncement
        }
    }
}