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
      try {
        const newAnnouncement = await prisma.announcement.create({
          data: {
            priority,
            creation_date: getNow(),
            message,
          },
        });

        await Promise.all(
          participants.map((participant) =>
            prisma.userAnnouncement.create({
              data: {
                participant_id: participant,
                announcement_id: newAnnouncement.announcement_id,
              },
            })
          )
        );

        return true;
      } catch (err) {
        throw new Error("Failed to create announcement");
      }
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
    participant: async (parent: { participant_id: number }) => {
      try {
        return await prisma.participant.findUnique({
          where: {
            participant_id: parent.participant_id,
          },
        });
      } catch (err) {
        throw new Error("Failed to get participant by announcement");
      }
    },
  },
};

export default announcementResolver;
