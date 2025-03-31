import { Announcement, PriorityType, StaffType } from "@prisma/client";
import AnnouncementService from "../../services/implementation/announcementImplementation";
import IAnnouncementService from "../../services/interface/announcementInterface";

const announcementService: IAnnouncementService = new AnnouncementService();
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
        from: StaffType;
        to: number[];
        priority: PriorityType;
        createdAt: Date;
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
        from: StaffType;
        to: number[];
        priority: PriorityType;
        createdAt: Date;
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
