import prisma from "../../prisma";
import type {
  INotificationService,
  NotificationDTO,
} from "../interfaces/notificationService";
import logger from "../../utilities/logger";
import { getErrorMessage } from "../../utilities/errorUtils";
import { IResidentService } from "../interfaces/residentService";
//import ResidentService from "./residentService";

//const residentService: IResidentService = new ResidentService();
const Logger = logger(__filename);

class NotificationService implements INotificationService {

  async getNotificationsByUserId(id: number): Promise<NotificationDTO[]> {
    try {
      const notifications = await prisma.notification.findMany({
        where: {
          id,
        },
        include: { recipients: true },
      });
      if (!notifications) throw new Error(`No Notifications found.`);
      return notifications;
    } catch (error) {
      Logger.error(
        `Failed to get Notification. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }


  async getNotificationById(id: number): Promise<NotificationDTO> {
    try {
      const notification = await prisma.notification.findUnique({
        where: {
          id,
        },
        include: {
          recipients: true,
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

  deleteUserNotification(
    userId: number, 
    notificationId: number
  ): Promise<NotificationDTO> {
    const test:any = "what"; 
    return test as Promise<NotificationDTO>;
  }

  updateSeenNotification(
    userId: number, 
    notificationId: number
  ): Promise<NotificationDTO> {
    const test:any = "what"; 
    return test as Promise<NotificationDTO>;
  }

  async sendAnnouncement(
    title: string,
    message: string,
    userId: number,
  ): Promise<NotificationDTO> {
    /*let newNotification: NotificationDTO;
    try {
      const activeResidents = await residentService.getActiveResidents();

      newNotification = await prisma.notification.create({
        data: {
          message: notifMessage,
          author: {
            connect: { id: staffId },
          },
          residents: {
            create: activeResidents.map((resident) => ({
              resident: {
                connect: {
                  id: resident.id,
                },
              },
            })),
          },
        },
        include: {
          residents: true,
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
    }*/
    const test:any = "what"; 
    return test as Promise<NotificationDTO>;
  }
}
export default NotificationService;
