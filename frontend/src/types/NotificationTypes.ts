export interface Announcement {
  id: number;
  author: string;
  message: string;
  createdAt: string;
}

export interface GroupAnnouncements {
  [key: string]: Announcement[];
}
