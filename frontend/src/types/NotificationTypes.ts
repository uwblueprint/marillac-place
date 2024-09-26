export interface Announcement {
  author: string;
  room: string;
  message: string;
  createdAt: string;
}

export interface GroupAnnouncements {
  [key: string]: Announcement[];
}
