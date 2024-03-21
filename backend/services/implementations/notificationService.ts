import prisma from "../../prisma";
import INotificationService, {
  NotificationDTO,
  NotificationReceivedDTO,
} from "../interfaces/notificationService";
import IResidentService from "../interfaces/residentService";
import logger from "../../utilities/logger";
import { getErrorMessage } from "../../utilities/errorUtils";

const Logger = logger(__filename);

class NotificationService implements INotificationService {
  residentService: IResidentService;

  constructor(residentService: IResidentService) {
    this.residentService = residentService;
  }

  async getNotificationsByUserId(
    id: number,
  ): Promise<NotificationReceivedDTO[]> {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
        include: {
          notificationsReceived: true,
        },
      });
      if (!user) throw new Error(`No User found.`);
      return user.notificationsReceived;
    } catch (error) {
      Logger.error(
        `Failed to get Notification. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async getNotificationById(id: number): Promise<NotificationReceivedDTO> {
    try {
      const notification = await prisma.notificationReceived.findUnique({
        where: {
          id,
        },
      });
      if (!notification) throw new Error(`notification id ${id} not found`);

      return notification;
    } catch (error: unknown) {
      Logger.error(
        `Failed to get Notification. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async sendNotification(
    authorId: number,
    title: string,
    message: string,
    recipientIds: number[],
  ): Promise<NotificationDTO> {
    try {
      const newNotification = await prisma.notification.create({
        data: {
          title,
          message,
          author: {
            connect: { id: authorId },
          },
          recipients: {
            create: recipientIds.map((recipient) => ({
              recipient: {
                connect: {
                  id: recipient,
                },
              },
            })),
          },
        },
        include: {
          recipients: true,
        },
      });

      return newNotification;
    } catch (error) {
      Logger.error(
        `Failed to create Notification. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async deleteUserNotification(
    notificationId: number,
  ): Promise<NotificationDTO> {
    try {
      const deletedNotification = await prisma.notification.delete({
        where: {
          id: notificationId,
        },
        include: { recipients: true },
      });

      if (!deletedNotification)
        throw new Error(`notification id ${notificationId} not found`);

      return deletedNotification;
    } catch (error) {
      Logger.error(
        `Failed to set isDelete flag. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async updateSeenNotification(
    notificationRecievedId: number,
  ): Promise<NotificationReceivedDTO> {
    try {
      await prisma.notificationReceived.update({
        where: {
          id: notificationRecievedId,
        },
        data: {
          seen: true,
        },
      });

      const updatedNotification = await prisma.notificationReceived.findUnique({
        where: {
          id: notificationRecievedId,
        },
      });

      if (!updatedNotification)
        throw new Error(`notification id ${notificationRecievedId} not found`);

      return updatedNotification;
    } catch (error) {
      Logger.error(
        `Failed to set seen flag. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async sendAnnouncement(
    title: string,
    message: string,
    userId: number,
  ): Promise<NotificationDTO> {
    try {
      const activeResidents = await this.residentService.getActiveResidents();
      const newNotification = await prisma.notification.create({
        data: {
          title,
          message,
          author: {
            connect: { id: userId },
          },
          recipients: {
            create: activeResidents.map((recipient) => ({
              recipient: {
                connect: {
                  id: recipient.userId,
                },
              },
            })),
          },
        },
        include: {
          recipients: true,
        },
      });
      return newNotification;
    } catch (error) {
      Logger.error(
        `Failed to create Notification for Announcement. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }
}

export default NotificationService;
