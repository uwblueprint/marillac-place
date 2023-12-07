import AdminService from "../../services/implementations/adminService";
import {
  IAdminService,
  NotificationDTO,
} from "../../services/interfaces/adminService";

// TODO: change staff_id to StaffService when its done
const adminService: IAdminService = new AdminService(3);

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
      { message, resident_id }: { message: string; resident_id: number },
    ): Promise<NotificationDTO> => {
      const newNotification = await adminService.sendNotification(
        message,
        Number(resident_id),
      );
      return newNotification;
    },
    sendAnnouncement: async (
      _parent: undefined,
      { message }: { message: string },
    ): Promise<NotificationDTO> => {
      const newAnnouncement = await adminService.sendAnnouncement(message);
      return newAnnouncement;
    },
  },
};
export default adminResolvers;
