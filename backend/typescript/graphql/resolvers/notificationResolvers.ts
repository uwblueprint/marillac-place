import { update } from "lodash";
import NotificationService from "../../services/implementations/notificationService";
import {
  INotificationService,
  NotificationDTO,
} from "../../services/interfaces/notificationService";

const notificationService: INotificationService = new NotificationService();

const notificationResolvers = {
  Query: {
    notificationsByUserId: async ( 
      _parent: undefined,
      { id }: { id: number },
    ): Promise<NotificationDTO[]> => {
      return notificationService.getNotificationsByUserId(Number(id));
    },
    notificationById: async (
      _parent: undefined,
      { id }: { id: number },
    ): Promise<NotificationDTO> => {
      return notificationService.getNotificationById(Number(id));
    },
  },

  Mutation: {
    sendNotification: async (
      _parent: undefined,
      {
        authorId,
        title,
        message,
        recipientIds,
      }: { authorId: number, title: string; message: string; recipientIds: number[] },
    ): Promise<NotificationDTO> => {
      recipientIds = recipientIds.map(id => Number(id));
      const newNotification = await notificationService.sendNotification(
        Number(authorId),
        title,
        message,
        recipientIds
      );
      return newNotification;
    },
    deleteUserNotification: async (
      _parent: undefined,
      {
        userId, 
        notificationId
      }: { userId: number, notificationId: number },
    ): Promise<NotificationDTO> => {
      const deletedNotification = await notificationService.deleteUserNotification(
        Number(userId), 
        Number(notificationId)
      );
      return deletedNotification;
    },
    updateSeenNotification: async (
      _parent: undefined,
      {
        userId, 
        notificationId
      }: { userId: number, notificationId: number },
    ): Promise<NotificationDTO> => {
      const updatedNotification = await notificationService.updateSeenNotification(
        Number(userId), 
        Number(notificationId)
      );
      return updatedNotification;
    },
    
    sendAnnouncement: async (
      _parent: undefined,
      { 
        title,
        message,
        userId,
      }: { title: string; message: string; userId: number },
    ): Promise<NotificationDTO> => {
      const newAnnouncement = await notificationService.sendAnnouncement(
        title,
        message,
        Number(userId),
      );
      return newAnnouncement;
    },
  },
};
export default notificationResolvers;
