import { Announcement, Priority } from "@prisma/client";
import prisma from "../../prisma";
import IAnnouncementService from "../interface/announcementInterface";

class AnnouncementService implements IAnnouncementService {
  async getAllAnnouncements(): Promise<Announcement[]> {
    try {
      const announcements = await prisma.announcement.findMany({
        include: {
          user_announcements: true
        },
      });

      return announcements;
    } catch (err) {
      throw new Error("Something went wrong");
    }
  }

  async getAnnouncementsInDateRange(start: string, end: string): Promise<Announcement[]> {
    try {
      const announcements = await prisma.announcement.findMany({
        where: {
          creation_date: {
            lte: start,
            gte: end,
          },
        },
        include: {
          user_announcements: true
        }
      });

      return announcements;
    } catch (err) {
      throw new Error("Something went wrong");
    }
  }

  async createAnnouncement(
    priority: Priority,
    participants: number[],
    message: string,
  ): Promise<boolean> {
    try {
      const today = new Date().toLocaleString("en-ca");
      const newAnnouncement = await prisma.announcement.create({
        data: {
          priority,
          creation_date: today,
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
    message?: string,
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

