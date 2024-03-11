import prisma from "../../prisma";
import type {
  INotificationService,
  NotificationDTO,
  NotificationRecievedDTO,
} from "../interfaces/notificationService";
import logger from "../../utilities/logger";
import { getErrorMessage } from "../../utilities/errorUtils";
import { IResidentService } from "../interfaces/residentService";
//import ResidentService from "./residentService";

//const residentService: IResidentService = new ResidentService();
const Logger = logger(__filename);

class NotificationService implements INotificationService {

  async getNotificationsByUserId(id: number): Promise<NotificationRecievedDTO[]> {
    try {
      const user = await prisma.userStub.findUnique({
        where: {
          id,
        },
        include: {
          notificationsReceived: true
        }
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


  async getNotificationById(id: number): Promise<NotificationRecievedDTO> {
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
    /*let newNotification: NotificationDTO;
    try {
      newNotification = await prisma.notification.create({
        data: {
          message: notifMessage,
          author: {
            connect: { id: authorId },
          },
          residents: {
            create: [
              {
                resident: {
                  connect: {
                    id: residentId,
                  },
                },
              },
            ],
          },
        },
        include: {
          residents: true,
        },
      });

      return newNotification;
    } catch (error) {
      Logger.error(
        `Failed to create Notification. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    } */
    const test:any = "what"; 
    return test as Promise<NotificationDTO>;
  }

  async deleteUserNotification(
    notificationId: number
  ): Promise<NotificationDTO> {
    try {

      const deletedNotification = await prisma.notification.delete({
        where: {
          id: notificationId,
        },
        include: {recipients: true}
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
    notificationRecievedId: number
  ): Promise<NotificationRecievedDTO> {
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
    let newNotification: NotificationDTO;
    try {
      //const activeResidents = await residentService.getActiveResidents();

      const activeUsers = await prisma.userStub.findMany()

      newNotification = await prisma.notification.create({
        data: {
          title: title,
          message: message,
          author: {
            connect: { id: userId },
          },
          recipients: {
            create: activeUsers.map((recipient) => ({
              recipient: {
                connect: {
                  id: recipient.id,
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
