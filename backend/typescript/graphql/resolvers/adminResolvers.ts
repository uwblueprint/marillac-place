import AdminService from "../../services/implementations/adminService";
import {
  IAdminService,
  NotificationDTO,
} from "../../services/interfaces/adminService";

const adminService: IAdminService = new AdminService();

const adminResolvers = {
  Query: {
    notificationById: async (
      _parent: undefined,
      { id }: { id: number },
    ): Promise<NotificationDTO> => {
      return adminService.getNotificationById(Number(id));
    },
    getAllNotifications: async (): Promise<NotificationDTO[]> => {
      return adminService.getAllNotifications();
    },
  },

  Mutation: {
    sendNotification: async (
      _parent: undefined,
      {
        message,
        residentId,
        staffId,
      }: { message: string; residentId: number; staffId: number },
    ): Promise<NotificationDTO> => {
      const newNotification = await adminService.sendNotification(
        message,
        Number(residentId),
        Number(staffId),
      );
      return newNotification;
    },
    sendAnnouncement: async (
      _parent: undefined,
      { message, staffId }: { message: string; staffId: number },
    ): Promise<NotificationDTO> => {
      const newAnnouncement = await adminService.sendAnnouncement(
        message,
        Number(staffId),
      );
      return newAnnouncement;
    },
  },
};
export default adminResolvers;
