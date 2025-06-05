import { Announcement, Priority } from "@prisma/client";

interface IAnnouncementService {
  getAllAnnouncements(): Promise<Announcement[]>;
  getAnnouncementsInDateRange(start: string, end: string): Promise<Announcement[]>;
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
}

export default IAnnouncementService;
