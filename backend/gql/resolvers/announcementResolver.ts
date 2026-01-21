import { Announcement, Priority } from "@prisma/client";
import db from "../../prisma";
import { getStartOfDay } from "../../utils/dateUtils";

const announcementResolver = {
  Query: {
    getAnnouncementsFromToday: async (): Promise<Announcement[]> => {
      return db.announcement.findMany({
        where: {
          date: { gte: getStartOfDay(new Date()) },
        },
        orderBy: {
          date: "desc",
        },
        include: {
          ReceivedAnnouncement: {
            include: {
              participant: {
                select: {
                  room: true,
                },
              },
            },
          },
        },
      });
    },
    getAnnouncementsSentToParticipants: async (
      _parent: undefined,
      {
        pids,
      }: {
        pids: number[];
      }
    ): Promise<Announcement[]> => {
      return db.announcement.findMany({
        orderBy: { date: "desc" },
        where: {
          ReceivedAnnouncement: {
            every: {
              pid: {
                in: pids,
              },
            },
          },
        },
        include: {
          ReceivedAnnouncement: true,
        },
      });
    },
  },
  Mutation: {
    createAnnouncement: async (
      _parent: undefined,
      {
        priority,
        pids,
        topic,
        message,
      }: {
        priority: Priority;
        pids: number[];
        topic: string;
        message: string;
      }
    ): Promise<Announcement> => {
      const announcement = await db.announcement.create({
        data: {
          priority,
          topic,
          message,
        },
      });

      await Promise.all(
        pids.map((pid) =>
          db.receivedAnnouncement.create({
            data: {
              pid,
              aid: announcement.aid,
            },
          })
        )
      );

      return announcement;
    },
    updateAnnouncement: async (
      _parent: undefined,
      {
        aid,
        priority,
        message,
      }: {
        aid: number;
        priority?: Priority;
        message?: string;
      }
    ): Promise<Announcement> => {
      const updates: Partial<Announcement> = {};
      if (priority !== undefined) updates.priority = priority;
      if (message !== undefined) updates.message = message;

      const isEmpty = Object.keys(updates).length === 0;
      if (isEmpty) throw new Error("no updates received");

      return db.announcement.update({
        where: { aid },
        data: updates,
      });
    },
    deleteAnnouncement: async (
      _parent: undefined,
      {
        aid,
      }: {
        aid: number;
      }
    ): Promise<Announcement> => {
      return db.announcement.delete({
        where: { aid },
      });
    },
  },
};

export default announcementResolver;
