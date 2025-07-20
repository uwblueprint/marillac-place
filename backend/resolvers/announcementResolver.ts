import { Announcement, Priority } from "@prisma/client";
import AnnouncementService from "../services/implementation/announcementImplementation";
import IAnnouncementService, { AnnouncementFilter } from "../services/interface/announcementInterface";
import prisma from "../prisma";

const announcementService: IAnnouncementService = new AnnouncementService();
const announcementResolver = {
  Query: {
    getAllAnnouncements: async (): Promise<Announcement[]> => {
      return announcementService.getAllAnnouncements();
    },
    getAnnouncementsInDateRange: async (
      _parent: undefined,
      { start, end }: { start: string; end: string }
    ): Promise<Announcement[]> => {
      return announcementService.getAnnouncementsInDateRange(start, end);
    },
    getAnnouncementsByParticipants: async (
      _parent: undefined,
      { participant_ids }: { participant_ids: number[] }
    ): Promise<Announcement[]> => {
      return announcementService.getAnnouncementsByParticipants(participant_ids);
    },
    getParticipantAnnouncements: async (
        _parent: undefined,
        { participantId, filter }: { participantId: number; filter: AnnouncementFilter }
    ) => {
        return announcementService.getParticipantAnnouncements(participantId, filter);
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
      return announcementService.createAnnouncement(
        priority,
        participants,
        message
      );
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
      return announcementService.editAnnouncement(
        announcement_id,
        priority,
        message
      );
    },
    deleteAnnouncement: async (
      _parent: undefined,
      { announcement_id }: { announcement_id: number }
    ): Promise<boolean> => {
      return announcementService.deleteAnnouncement(announcement_id);
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
