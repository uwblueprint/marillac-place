// src/pages/participant/announcements/elements/Announcement.ts
export default class Announcement {
  id: string;

  allRooms: boolean;

  message: string;

  importance: number;

  hasRead: boolean;

  isPinned: boolean;

  time: string;

  constructor(
    id: string,
    allRooms: boolean,
    message: string,
    importance: number,
    hasRead: boolean,
    isPinned: boolean,
    time: string
  ) {
    this.id = id;
    this.allRooms = allRooms;
    this.message = message;
    this.importance = importance;
    this.hasRead = hasRead;
    this.isPinned = isPinned;
    this.time = time;
  }

  copy(
    patch: Partial<
      Pick<
        Announcement,
        "allRooms" | "message" | "importance" | "hasRead" | "isPinned" | "time"
      >
    >
  ): Announcement {
    return new Announcement(
      this.id,
      patch.allRooms ?? this.allRooms,
      patch.message ?? this.message,
      patch.importance ?? this.importance,
      patch.hasRead ?? this.hasRead,
      patch.isPinned ?? this.isPinned,
      patch.time ?? this.time
    );
  }
}

export const announcementData = [
  new Announcement(
    "1",
    true,
    "Reminding you about your social this Monday, remember to bring everything you need for this activity! Things to bring include sunscreen, water, bug repellent, running shoes, hair ties and anything else you deem necessary.",
    1,
    false,
    true,
    "7:00pm, June 1"
  ),
  new Announcement(
    "2",
    false,
    "Don't forget to submit your pre-camp survey by this Friday! The survey will help us understand your needs and preferences for the camp.",
    0,
    true,
    false,
    "3:00pm, May 28"
  ),
  new Announcement(
    "3",
    true,
    "Important update regarding COVID-19 protocols. Please read the following guidelines carefully to ensure the safety of all participants and staff during the camp.",
    2,
    false,
    true,
    "12:00pm, May 25"
  ),
  new Announcement(
    "4",
    false,
    "We are excited to announce a new activity for this year's camp! Join us for a fun-filled day of hiking and outdoor adventures.",
    0,
    true,
    false,
    "9:00am, May 20"
  ),
  new Announcement(
    "5",
    true,
    "Reminder: The deadline to register for the camp is approaching fast! Make sure to complete your registration by the end of this week to secure your spot.",
    1,
    false,
    false,
    "5:00pm, May 15"
  ),
];
