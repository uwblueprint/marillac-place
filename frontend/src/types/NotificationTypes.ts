export interface Announcement {
  author: string;
  message: string;
  createdAt: string;
}

export interface GroupAnnouncements {
  [key: string]: Announcement[];
}
