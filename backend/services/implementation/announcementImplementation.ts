import { Announcement, Priority } from "@prisma/client";
import prisma from "../../prisma";
import IAnnouncementService from "../interface/announcementInterface";
import { getNow } from "../../utils/formatDateTime";

class AnnouncementService implements IAnnouncementService {
  async getAllAnnouncements(): Promise<Announcement[]> {
    try {
      const announcements = await prisma.announcement.findMany({
        orderBy: {
          creation_date: "desc",
        },
        include: {
          user_announcements: true,
        },
      });

      return announcements;
    } catch (err) {
      throw new Error("Something went wrong");
    }
  }

  async getAnnouncementsInDateRange(
    start: string,
    end: string
  ): Promise<Announcement[]> {
    try {
      const announcements = await prisma.announcement.findMany({
        where: {
          creation_date: {
            lte: end,
            gte: start,
          },
        },
        orderBy: {
          creation_date: "desc",
        },
        include: {
          user_announcements: {
            include: {
              participant: {
                select: {
                  room_number: true,
                },
              },
            },
          },
        },
      });

      return announcements;
    } catch (err) {
      throw new Error("Something went wrong");
    }
  }

  async getAnnouncementsByParticipants(
    participant_ids: number[]
  ): Promise<Announcement[]> {
    try {
      const announcements = await prisma.announcement.findMany({
        orderBy: {
          creation_date: "desc",
        },
        where: {
          user_announcements: {
            some: {
              participant_id: {
                in: participant_ids,
              },
            },
          },
        },
        include: {
          user_announcements: true,
        },
      });

      return announcements;
    } catch (err) {
      throw new Error("Something went wrong");
    }
  }

  async getAnnouncementsByParticipantIdAndDate(
    participant_id: number,
    start_date: string,
    end_date: string
  ): Promise<Announcement[]> {
    try {
      const announcements = await prisma.announcement.findMany({
        orderBy: {
          creation_date: "desc",
        },
        where: {
          AND: [
            {
              creation_date: {
                lte: end_date,
                gte: start_date,
              },
            },
            {
              user_announcements: {
                some: {
                  participant_id,
                },
              },
            },
          ],
        },
        include: {
          user_announcements: true,
        },
      });

      return announcements;
    } catch (err) {
      throw new Error("Something went wrong");
    }
  }

  async createAnnouncement(
    priority: Priority,
    participants: number[],
    message: string
  ): Promise<boolean> {
    try {
      const newAnnouncement = await prisma.announcement.create({
        data: {
          priority,
          creation_date: getNow(),
          message,
        },
      });

      for (const participant of participants) {
        await prisma.userAnnouncement.create({
          data: {
            participant_id: participant,
            announcement_id: newAnnouncement.announcement_id,
          },
        });
      }

      return true;
    } catch (err) {
      throw new Error("Something went wrong");
    }
  }

  async editAnnouncement(
    announcement_id: number,
    priority?: Priority,
    message?: string
  ): Promise<boolean> {
    const updatedData: Record<string, any> = {};
    if (priority) updatedData.priority = priority;
    if (message) updatedData.message = message;

    try {
      await prisma.announcement.update({
        where: { announcement_id },
        data: updatedData,
      });
      return true;
    } catch (err) {
      throw new Error("Something went wrong");
    }
  }

  async deleteAnnouncement(announcement_id: number): Promise<boolean> {
    try {
      await prisma.announcement.delete({
        where: {
          announcement_id,
        },
      });
      return true;
    } catch (err) {
      throw new Error("Something went wrong");
    }
  }
}

export default AnnouncementService;
