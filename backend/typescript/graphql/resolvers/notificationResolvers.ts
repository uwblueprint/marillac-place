import NotificationService from "../../services/implementations/notificationService";
import {
  INotificationService,
  NotificationDTO,
  NotificationRecievedDTO,
} from "../../services/interfaces/notificationService";

const notificationService: INotificationService = new NotificationService();

const notificationResolvers = {
  Query: {
    notificationsByUserId: async (
      _parent: undefined,
      { id }: { id: number },
    ): Promise<NotificationRecievedDTO[]> => {
      return notificationService.getNotificationsByUserId(Number(id));
    },
    notificationById: async (
      _parent: undefined,
      { id }: { id: number },
    ): Promise<NotificationRecievedDTO> => {
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
      }: {
        authorId: number;
        title: string;
        message: string;
        recipientIds: number[];
      },
    ): Promise<NotificationDTO> => {
      const Ids = recipientIds.map((id) => Number(id));
      const newNotification = await notificationService.sendNotification(
        Number(authorId),
        title,
        message,
        Ids,
      );
      return newNotification;
    },
    deleteUserNotification: async (
      _parent: undefined,
      { notificationId }: { notificationId: number },
    ): Promise<NotificationDTO> => {
      const deletedNotification = await notificationService.deleteUserNotification(
        Number(notificationId),
      );
      return deletedNotification;
    },
    updateSeenNotification: async (
      _parent: undefined,
      { notificationId }: { notificationId: number },
    ): Promise<NotificationRecievedDTO> => {
      const updatedNotification = await notificationService.updateSeenNotification(
        Number(notificationId),
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
