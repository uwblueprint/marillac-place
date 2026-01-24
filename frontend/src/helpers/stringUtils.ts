import { ROOM_NUMBERS } from "../constants/rooms";
import { Announcement, ReceivedAnnouncement } from "../types/models";

export function toTitleCase(str: string): string {
  return str
    .replaceAll("_", " ")
    .toLowerCase()
    .split(" ")
    .filter((word) => word.length > 0)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export const getRoomString = (announcement: Announcement) => {
  const rooms = (
    announcement.ReceivedAnnouncement?.map((ra: ReceivedAnnouncement) => 
      ra.participant?.room).filter((room) => room !== undefined) ?? []
    ).sort((a, b) => Number(a) - Number(b));

  if (announcement.ReceivedAnnouncement?.length === 1) {
    return `Room ${rooms[0]}`;
  }

  if (rooms.length === ROOM_NUMBERS.length) {
    return "All Rooms";
  }
  return `Rooms ${rooms.join(", ")}`;
};
