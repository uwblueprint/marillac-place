import { Announcement } from "@prisma/client";
import AnnouncementService from "../../services/implementation/announcementImplementation";

const announcementService = new AnnouncementService();
const announcementResolvers = {
  Query: {
    getAllAnnouncements: async (): Promise<Announcement[]> => {
      return announcementService.getAllAnnouncements();
    },
    getAnnouncementByRooms: async (
      _parent: undefined,
      { rooms }: { rooms: number[] },
    ): Promise<Announcement[]> => {
      return announcementService.getAnnouncementByRooms(rooms);
    },
  },
  Mutation: {
    createAnnouncement: async (
      _parent: undefined,
      {
        announcementId,
        from,
        to,
        priority,
        createdAt,
        message,
      }: {
        announcementId: number;
        from: string;
        to: number[];
        priority: string;
        createdAt: string;
        message: string;
      },
    ): Promise<boolean> => {
      return announcementService.createAnnouncement(
        announcementId,
        from,
        to,
        priority,
        createdAt,
        message,
      );
    },
    editAnnouncement: async (
      _parent: undefined,
      {
        announcementId,
        from,
        to,
        priority,
        createdAt,
        message,
      }: {
        announcementId: number;
        from: string;
        to: number[];
        priority: string;
        createdAt: string;
        message: string;
      },
    ): Promise<boolean> => {
      return announcementService.editAnnouncement(
        announcementId,
        from,
        to,
        priority,
        createdAt,
        message,
      );
    },
    deleteAnnouncement: async (
      _parent: undefined,
      { announcementId }: { announcementId: number },
    ): Promise<boolean> => {
      return announcementService.deleteAnnouncement(announcementId);
    },
  },
};

export default announcementResolvers;
