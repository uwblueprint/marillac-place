import { Announcement, Priority, UserAnnouncement } from "@prisma/client";

export type AnnouncementFilter = "ALL" | "UNREAD" | "PINNED" | "IMPORTANT";

interface IAnnouncementService {
  getAllAnnouncements(): Promise<Announcement[]>;
  getAnnouncementsInDateRange(start: string, end: string): Promise<Announcement[]>;
  getAnnouncementsByParticipants(participant_ids: number[]): Promise<Announcement[]>;
  createAnnouncement(
    priority: Priority,
    participants: number[],
    message: string,
  ): Promise<boolean>;
  editAnnouncement(
    announcement_id: number,
    priority?: Priority,
    message?: string,
  ): Promise<boolean>;
  deleteAnnouncement(announcementId: number): Promise<boolean>;

 /** New: per‐user filtered announcements */
 getParticipantAnnouncements(
   participantId: number,
   filter: AnnouncementFilter
 ): Promise<(UserAnnouncement & { announcement: Announcement })[]>;
}

export default IAnnouncementService;
