import prisma from "../../prisma";
import type {
  IAdminService,
  NotificationDTO,
} from "../interfaces/notificationService";
import logger from "../../utilities/logger";
import { getErrorMessage } from "../../utilities/errorUtils";
import { IResidentService } from "../interfaces/residentService";
import ResidentService from "./residentService";

const residentService: IResidentService = new ResidentService();
const Logger = logger(__filename);

class AdminService implements IAdminService {
  async getAllNotifications(): Promise<NotificationDTO[]> {
    try {
      const notifications = await prisma.notification.findMany({
        include: { residents: true },
      });
      if (!notifications) throw new Error(`No Notifications found.`);
      return notifications;
    } catch (error) {
      Logger.error(
        `Failed to get all Notifications. Reason = ${getErrorMessage(error)}`,
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
          residents: true,
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
    notifMessage: string,
    residentId: number,
    staffId: number,
  ): Promise<NotificationDTO> {
    let newNotification: NotificationDTO;
    try {
      newNotification = await prisma.notification.create({
        data: {
          message: notifMessage,
          author: {
            connect: { id: staffId },
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
    }
  }

  async sendAnnouncement(
    notifMessage: string,
    staffId: number,
  ): Promise<NotificationDTO> {
    let newNotification: NotificationDTO;
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
    }
  }

  async deleteNotificationForResident(
    notifId: number,
    residentId: number,
  ): Promise<NotificationDTO> {
    try {
      await prisma.notificationResident.update({
        where: {
          notificationId_residentId: {
            notificationId: notifId,
            residentId,
          },
        },
        data: {
          isDeleted: true,
        },
      });

      const updatedNotification = await prisma.notification.findUnique({
        where: {
          id: notifId,
        },
        include: {
          residents: true,
        },
      });

      if (!updatedNotification)
        throw new Error(`notification id ${notifId} not found`);

      return updatedNotification;
    } catch (error) {
      Logger.error(
        `Failed to set isDelete flag. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async updateSeenForResident(
    notifId: number,
    residentId: number,
  ): Promise<NotificationDTO> {
    try {
      await prisma.notificationResident.update({
        where: {
          notificationId_residentId: {
            notificationId: notifId,
            residentId,
          },
        },
        data: {
          seen: true,
        },
      });

      const updatedNotification = await prisma.notification.findUnique({
        where: {
          id: notifId,
        },
        include: {
          residents: true,
        },
      });

      if (!updatedNotification)
        throw new Error(`notification id ${notifId} not found`);

      return updatedNotification;
    } catch (error) {
      Logger.error(
        `Failed to set seen flag. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }
}
export default AdminService;
