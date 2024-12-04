import prisma from "../../prisma";
import INotificationService, {
  NotificationDTO,
  NotificationReceivedDTO,
  NotificationGroupDTO,
  CreateNotificationDTO,
  UpdateNotificationDTO,
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

  async createNotificationGroup(
    roomIds: number[],
  ): Promise<NotificationGroupDTO> {
    try {
      const residents = await prisma.resident.findMany({
        where: { roomNumber: { in: roomIds } },
      });
      const residentIds = residents.map((resident) => resident.userId);

      const newNotificationGroup = await prisma.notificationGroup.create({
        data: {
          recipients: {
            connect: residentIds.map((id) => ({ userId: id })),
          },
          announcementGroup: false,
        },
      });

      return newNotificationGroup;
    } catch (error) {
      Logger.error(
        `Failed to create Notification Group. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }

  async createAnnouncementGroup(): Promise<NotificationGroupDTO> {
    try {
      const residents = await prisma.resident.findMany();
      const residentIds = residents.map((resident) => resident.userId);

      const newNotificationGroup = await prisma.notificationGroup.create({
        data: {
          recipients: {
            connect: residentIds.map((id) => ({ userId: id })),
          },
          announcementGroup: true,
        },
      });

      return newNotificationGroup;
    } catch (error) {
      Logger.error(
        `Failed to create Notification Group. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }

  async sendNotificationToGroup(
    groupId: number,
    notification: CreateNotificationDTO,
  ): Promise<NotificationDTO> {
    try {
      const notificationGroup = await prisma.notificationGroup.findUnique({
        where: { id: groupId },
        include: { recipients: true },
      });
      const newNotification = await prisma.notification.create({
        data: {
          message: notification.message,
          createdAt: notification.createdAt,
          author: {
            connect: notification.authorId
              ? { userId: notification.authorId }
              : undefined,
          },
          group: {
            connect: { id: groupId },
          },
          notificationReceived: {
            create: notificationGroup
              ? notificationGroup.recipients.map((resident) => ({
                  recipient: {
                    connect: { userId: resident.userId },
                  },
                }))
              : undefined,
          },
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

  async deleteNotificationGroup(
    groupId: number,
  ): Promise<NotificationGroupDTO> {
    try {
      const deletedNotificationGroup = await prisma.notificationGroup.delete({
        where: {
          id: groupId,
        },
      });

      if (!deletedNotificationGroup)
        throw new Error(`notification id ${groupId} not found`);

      return deletedNotificationGroup;
    } catch (error) {
      Logger.error(
        `Failed to set isDelete flag. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async getAllGroupsAndNotifications(): Promise<NotificationGroupDTO[]> {
    try {
      const notificationGroups = await prisma.notificationGroup.findMany({
        include: {
          // recipients: true, // TODO: resident type is incompatiable at time of writing
          notifications: true,
        },
      });
      return notificationGroups;
    } catch (error) {
      Logger.error(
        `Failed to create Notification. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async getNotificationsByIds(
    notificationIds: number[],
  ): Promise<NotificationReceivedDTO[]> {
    try {
      const notificationReceived = await prisma.notificationReceived.findMany({
        where: { notificationId: { in: notificationIds } },
        include: { notification: true },
      });

      if (!notificationReceived) throw new Error(`No User found.`);
      return notificationReceived;
    } catch (error) {
      Logger.error(
        `Failed to get Notification. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async updateNotificationById(
    notificationId: number,
    notification: UpdateNotificationDTO,
  ): Promise<NotificationDTO> {
    try {
      const updatedNotification = await prisma.notification.update({
        where: {
          id: notificationId,
        },
        data: {
          ...notification,
        },
      });

      if (!updatedNotification)
        throw new Error(`notification id ${notificationId} not found`);

      return updatedNotification;
    } catch (error) {
      Logger.error(
        `Failed to set seen flag. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async deleteNotificationByIds(notficationId: number[]): Promise<boolean> {
    try {
      const deletedNotification = await prisma.notification.deleteMany({
        where: { id: { in: notficationId } },
      });

      if (!deletedNotification)
        throw new Error(`notification id ${notficationId} not found`);
      return true;
    } catch (error) {
      Logger.error(
        `Failed to set isDelete flag. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async updateSeenNotification(
    notificationSeenId: number,
  ): Promise<NotificationReceivedDTO> {
    try {
      await prisma.notificationReceived.update({
        where: {
          id: notificationSeenId,
        },
        data: {
          seen: true,
        },
      });

      const updatedNotification = await prisma.notificationReceived.findUnique({
        where: {
          id: notificationSeenId,
        },
      });

      if (!updatedNotification)
        throw new Error(`notification id ${notificationSeenId} not found`);

      return updatedNotification;
    } catch (error) {
      Logger.error(
        `Failed to set seen flag. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async getNotificationByResident(
    residentId: number,
  ): Promise<NotificationReceivedDTO[]> {
    try {
      const notification = await prisma.notificationReceived.findMany({
        where: {
          recipientId: residentId,
        },
        include: { notification: true },
      });
      if (!notification)
        throw new Error(`notification id ${residentId} not found`);

      return notification;
    } catch (error: unknown) {
      Logger.error(
        `Failed to get Notification. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  // async getNotificationsByRoomIds(
  //   roomIds: number[],
  // ): Promise<NotificationReceivedDTO[]> {
  //   try {
  //     const residents = await prisma.resident.findMany({
  //       where: { roomNumber: { in: roomIds } },
  //     });
  //     const residentIds = residents.map((resident) => resident.userId);

  //     const notificationReceived = await prisma.notificationReceived.findMany({
  //       where: { recipientId: { in: residentIds } },
  //     });
  //     if (!notificationReceived) throw new Error(`No User found.`);
  //     return notificationReceived;
  //   } catch (error) {
  //     Logger.error(
  //       `Failed to get Notification. Reason = ${getErrorMessage(error)}`,
  //     );
  //     throw error;
  //   }
  // }

  // async getNotificationById(id: number): Promise<NotificationReceivedDTO> {
  //   try {
  //     const notification = await prisma.notificationReceived.findUnique({
  //       where: {
  //         id,
  //       },
  //     });
  //     if (!notification) throw new Error(`notification id ${id} not found`);

  //     return notification;
  //   } catch (error: unknown) {
  //     Logger.error(
  //       `Failed to get Notification. Reason = ${getErrorMessage(error)}`,
  //     );
  //     throw error;
  //   }
  // }

  // async sendNotification(
  //   authorId: number,
  //   title: string,
  //   message: string,
  //   roomIds: number[],
  // ): Promise<NotificationDTO> {
  //   try {
  //     const residents = await prisma.resident.findMany({
  //       where: { roomNumber: { in: roomIds } },
  //     });
  //     const residentIds = residents.map((resident) => resident.userId);

  //     const newNotification = await prisma.notification.create({
  //       data: {
  //         title,
  //         message,
  //         author: {
  //           connect: { id: authorId },
  //         },
  //         recipients: {
  //           create: residentIds.map((resident) => ({
  //             recipient: {
  //               connect: {
  //                 id: resident,
  //               },
  //             },
  //           })),
  //         },
  //       },
  //       include: {
  //         recipients: true,
  //       },
  //     });

  //     return newNotification;
  //   } catch (error) {
  //     Logger.error(
  //       `Failed to create Notification. Reason = ${getErrorMessage(error)}`,
  //     );
  //     throw error;
  //   }
  // }

  // async deleteUserNotification(
  //   notificationId: number,
  // ): Promise<NotificationDTO> {
  //   try {
  //     const deletedNotification = await prisma.notification.delete({
  //       where: {
  //         id: notificationId,
  //       },
  //       include: { recipients: true },
  //     });

  //     if (!deletedNotification)
  //       throw new Error(`notification id ${notificationId} not found`);

  //     return deletedNotification;
  //   } catch (error) {
  //     Logger.error(
  //       `Failed to set isDelete flag. Reason = ${getErrorMessage(error)}`,
  //     );
  //     throw error;
  //   }
  // }

  // async updateSeenNotification(
  //   notificationRecievedId: number,
  // ): Promise<NotificationReceivedDTO> {
  //   try {
  //     await prisma.notificationReceived.update({
  //       where: {
  //         id: notificationRecievedId,
  //       },
  //       data: {
  //         seen: true,
  //       },
  //     });

  //     const updatedNotification = await prisma.notificationReceived.findUnique({
  //       where: {
  //         id: notificationRecievedId,
  //       },
  //     });

  //     if (!updatedNotification)
  //       throw new Error(`notification id ${notificationRecievedId} not found`);

  //     return updatedNotification;
  //   } catch (error) {
  //     Logger.error(
  //       `Failed to set seen flag. Reason = ${getErrorMessage(error)}`,
  //     );
  //     throw error;
  //   }
  // }

  // async updateNotificationById(
  //   notificationId: number,
  //   notification: UpdateNotificationDTO,
  // ): Promise<NotificationDTO> {
  //   try {
  //     const updatedNotification = await prisma.notification.update({
  //       where: {
  //         id: notificationId,
  //       },
  //       data: {
  //         ...notification,
  //       },
  //       include: {
  //         recipients: true,
  //       },
  //     });

  //     if (!updatedNotification)
  //       throw new Error(`notification id ${notificationId} not found`);

  //     return updatedNotification;
  //   } catch (error) {
  //     Logger.error(
  //       `Failed to set seen flag. Reason = ${getErrorMessage(error)}`,
  //     );
  //     throw error;
  //   }
  // }

  // async sendAnnouncement(
  //   title: string,
  //   message: string,
  //   userId: number,
  // ): Promise<NotificationDTO> {
  //   try {
  //     const activeResidents = await this.residentService.getActiveResidents();
  //     const newNotification = await prisma.notification.create({
  //       data: {
  //         title,
  //         message,
  //         author: {
  //           connect: { id: userId },
  //         },
  //         recipients: {
  //           create: activeResidents.map((recipient) => ({
  //             recipient: {
  //               connect: {
  //                 id: recipient.userId,
  //               },
  //             },
  //           })),
  //         },
  //       },
  //       include: {
  //         recipients: true,
  //       },
  //     });
  //     return newNotification;
  //   } catch (error) {
  //     Logger.error(
  //       `Failed to create Notification for Announcement. Reason = ${getErrorMessage(
  //         error,
  //       )}`,
  //     );
  //     throw error;
  //   }
  // }
}

export default NotificationService;
