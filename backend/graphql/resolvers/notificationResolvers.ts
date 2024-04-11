import NotificationService from "../../services/implementations/notificationService";
import INotificationService, {
  NotificationDTO,
  NotificationReceivedDTO,
} from "../../services/interfaces/notificationService";
import IResidentService from "../../services/interfaces/residentService";
import ResidentService from "../../services/implementations/residentService";

const residentService: IResidentService = new ResidentService();
const notificationService: INotificationService = new NotificationService(
  residentService,
);

const notificationResolvers = {
  Query: {
    getNotificationsByUserId: async (
      _parent: undefined,
      { userId }: { userId: string },
    ): Promise<NotificationReceivedDTO[]> => {
      return notificationService.getNotificationsByUserId(Number(userId));
    },
    getNotificationById: async (
      _parent: undefined,
      { id }: { id: string },
    ): Promise<NotificationReceivedDTO> => {
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
      const ids = recipientIds.map((id) => Number(id));
      const newNotification = await notificationService.sendNotification(
        Number(authorId),
        title,
        message,
        ids,
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
    ): Promise<NotificationReceivedDTO> => {
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
