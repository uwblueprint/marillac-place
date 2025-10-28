export interface Participant {
  participant_id: number;
  room_number: number;
  arrival_date: string;
  departure_date?: string;
}

export interface UserAnnouncement {
  read: boolean;
  pinned: boolean;
  participant_id: number;
  participant: Participant;
}

export interface AnnouncementData {
  announcement_id: number;
  priority: string;
  creation_date: string;
  message: string;
  user_announcements: UserAnnouncement[];
}

export interface AnnouncementDisplayInfo {
  announcement_id: number;
  rooms: number[];
  creation_date: Date;
  message: string;
}

export enum Priority {
  NORMAL = "NORMAL",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL"
}