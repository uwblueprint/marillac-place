import AdminService from "../../services/implementations/notificationService";
import {
  IAdminService,
  NotificationDTO,
} from "../../services/interfaces/notificationService";

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
    deleteNotificationForResident: async (
      _parent: undefined,
      {
        notificationId,
        residentId,
      }: { notificationId: number; residentId: number },
    ): Promise<NotificationDTO> => {
      const updatedNotification = await adminService.deleteNotificationForResident(
        Number(notificationId),
        Number(residentId),
      );
      return updatedNotification;
    },
    updateSeenForResident: async (
      _parent: undefined,
      {
        notificationId,
        residentId,
      }: { notificationId: number; residentId: number },
    ): Promise<NotificationDTO> => {
      const updatedNotification = await adminService.updateSeenForResident(
        Number(notificationId),
        Number(residentId),
      );
      return updatedNotification;
    },
  },
};
export default adminResolvers;
