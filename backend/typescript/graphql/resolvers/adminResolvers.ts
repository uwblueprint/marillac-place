import { Prisma } from "@prisma/client"
import AdminService from "../../services/implementations/adminService"
import {
    IAdminService,
    NotificationDTO
} from "../../services/interfaces/adminService"
import { ResidentDTO } from "../../services/interfaces/residentService";

// change staff_id to StaffService when its done 
const adminService: IAdminService = new AdminService(3)

const adminResolvers = { 
    Query: {
        notificationById: async (
            _parent: undefined,
            { id }: { id: number},
        ): Promise<NotificationDTO> => {
            return await adminService.getNotificationById(id)
        },
        activeResidents: async (
            _parent: undefined,
        ): Promise<ResidentDTO[]> => {
            const activeResidents = await adminService.getActiveResidents()
            return activeResidents
        }
    },

    Mutation: {
        sendNotification: async (
            _parent: undefined,
            {message, resident_id}: {message: String; resident_id: number},
        ): Promise<NotificationDTO> => {
            const newNotification = await adminService.sendNotification(message, resident_id)
            return newNotification
        },
        sendAnnouncement: async ( 
            _parent: undefined,
            {message}: {message: String},
        ): Promise<NotificationDTO> => {
            const newAnnouncement = await adminService.sendAnnouncement(message);
            return newAnnouncement
        }
    }
}
export default adminResolvers;