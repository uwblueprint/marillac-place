import { PrismaClient, Announcement, Priority } from "@prisma/client";
import { getNow } from "../utils/formatDateTime";

const prisma = new PrismaClient();

const announcementResolver = {
  Query: {
    getAllAnnouncements: async (): Promise<Announcement[]> => {
      try {
        return await prisma.announcement.findMany({
          orderBy: {
            creation_date: "desc",
          },
          include: {
            user_announcements: true,
          },
        });
      } catch (err) {
        throw new Error("Failed to get all announcements");
      }
    },
    getAnnouncementsInDateRange: async (
      _parent: undefined,
      { start, end }: { start: string; end: string }
    ): Promise<Announcement[]> => {
      try {
        return await prisma.announcement.findMany({
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
      } catch (err) {
        throw new Error("Failed to get announcements in date range");
      }
    },
    getAnnouncementsByParticipants: async (
      _parent: undefined,
      { participant_ids }: { participant_ids: number[] }
    ): Promise<Announcement[]> => {
      try {
        return await prisma.announcement.findMany({
          orderBy: {
            creation_date: "desc",
          },
          where: {
            user_announcements: {
              every: {
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
      } catch (err) {
        throw new Error("Failed to get announcements by participants");
      }
    },
  },
  Mutation: {
    createAnnouncement: async (
      _parent: undefined,
      {
        priority,
        participants,
        message,
      }: {
        priority: Priority;
        participants: number[];
        message: string;
      }
    ): Promise<boolean> => {
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
    },
    editAnnouncement: async (
      _parent: undefined,
      {
        announcement_id,
        priority,
        message,
      }: {
        announcement_id: number;
        priority?: Priority;
        message?: string;
      }
    ): Promise<boolean> => {
      const updatedData: Record<string, any> = {};
      if (priority) updatedData.priority = priority;
      if (message) updatedData.message = message;

      await prisma.announcement.update({
        where: { announcement_id },
        data: updatedData,
      });
      return true;
    },
    deleteAnnouncement: async (
      _parent: undefined,
      { announcement_id }: { announcement_id: number }
    ): Promise<boolean> => {
      await prisma.announcement.delete({
        where: {
          announcement_id,
        },
      });
      return true;
    },
  },
  UserAnnouncement: {
    participant: async (parent: any) => {
      return prisma.participant.findUnique({
        where: {
          participant_id: parent.participant_id,
        },
      });
    },
  },
};

export default announcementResolver;
