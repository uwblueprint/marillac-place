import { Announcement, Priority } from "@prisma/client";
import { getToday } from "../../utils/dateUtils";
import db from "../../prisma";

const announcementResolver = {
  Query: {
    getAnnouncementsFromToday: async (): Promise<Announcement[]> => {
      const today = getToday();
      return await db.announcement.findMany({
        where: {
          date: { gte: today },
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
      { pids }: { 
        pids: number[] 
      }
    ): Promise<Announcement[]> => {
      return await db.announcement.findMany({
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
      { priority, pids, message }: {
        priority: Priority;
        pids: number[];
        message: string;
      }
    ): Promise<Announcement> => {
      const announcement = await db.announcement.create({
        data: {
          priority,
          date: new Date(),
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
      { aid, priority, message }: {
        aid: number;
        priority?: Priority;
        message?: string;
      }
    ): Promise<Announcement> => {
      const updates: any = {};
      if (priority !== undefined) updates.priority = priority;
      if (message !== undefined) updates.message = message;

      const isEmpty = Object.keys(updates).length === 0;
      if (isEmpty) throw new Error("no updates received");

      return await db.announcement.update({
        where: { aid },
        data: updates,
      });
    },
    deleteAnnouncement: async (
      _parent: undefined,
      { aid }: { 
        aid: number 
      }
    ): Promise<Announcement> => {
      return await db.announcement.delete({
        where: { aid }
      });
    },
  },
};

export default announcementResolver;
