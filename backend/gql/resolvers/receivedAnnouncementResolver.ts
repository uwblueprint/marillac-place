import { Priority, ReceivedAnnouncement } from "@prisma/client";
import db from "../../prisma";

const receivedAnnouncementResolver = {
  Query: {
    getReceivedAnnouncements: async (
      _parent: undefined,
      { pid, unread, pinned, important }: { 
        pid: number; 
        unread?: boolean;
        pinned?: boolean;
        important?: boolean;
      }
    ): Promise<ReceivedAnnouncement[]> => {
      const where: any = { pid };

      if (unread !== undefined) where.read = !unread;
      if (pinned !== undefined) where.pinned = pinned;
      if (important !== undefined && important) {
        where.announcement = { priority: { in: [Priority.HIGH, Priority.CRITICAL] } }
      } else if (important !== undefined && !important) {
        where.announcement = { priority: Priority.NORMAL }
      }

      return db.receivedAnnouncement.findMany({
        where,
        include: { announcement: true },
        orderBy: { announcement: { date: "desc" } },
      });
    },
  },
  Mutation: {
    updateReceivedAnnouncement: async (
      _parent: undefined,
      { aid, pid, read, pinned }: {
        aid: number;
        pid: number;
        pinned?: boolean;
        read?: boolean;
      }
    ): Promise<ReceivedAnnouncement> => {
      const updates: any = {};
      if (pinned !== undefined) updates.pinned = pinned;
      if (read !== undefined) updates.read = read;

      const isEmpty = Object.keys(updates).length === 0;
      if (isEmpty) throw new Error("no updates received");

      return db.receivedAnnouncement.update({
        where: {
          aid_pid: { aid, pid },
        },
        data: updates,
      });
    },
  },
  UserAnnouncement: {
    participant: async (parent: { pid: number }) => {
      return db.participant.findUnique({
        where: { pid: parent.pid }
      });
    },
  },
};

export default receivedAnnouncementResolver;
