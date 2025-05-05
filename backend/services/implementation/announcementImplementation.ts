// import { Announcement, StaffType, PriorityType } from "@prisma/client";
// import prisma from "../../prisma";
// import IAnnouncementService from "../interface/announcementInterface";
//
// class AnnouncementService implements IAnnouncementService {
//   async getAllAnnouncements(): Promise<Announcement[] | null> {
//     try {
//       const announcements = await prisma.announcement.findMany({
//         orderBy: [{ createdAt: "asc" }],
//       });
//       return announcements;
//     } catch (err) {
//       console.log(err);
//       throw err;
//     }
//   }
//
//   async getAnnouncementByRooms(
//     rooms: number[],
//   ): Promise<Announcement[] | null> {
//     try {
//       const annoucements = await prisma.announcement.findMany({
//         where: {
//           to: {
//             hasSome: rooms,
//           },
//         },
//         orderBy: [{ createdAt: "asc" }],
//       });
//       return annoucements;
//     } catch (err) {
//       console.log(err);
//       throw err;
//     }
//   }
//
//   async createAnnouncement(
//     announcementId: number,
//     from: StaffType,
//     to: number[],
//     priority: PriorityType,
//     createdAt: Date,
//     message: string,
//   ): Promise<boolean> {
//     try {
//       await prisma.announcement.create({
//         data: {
//           announcementId,
//           from,
//           to,
//           priority,
//           createdAt,
//           message,
//         },
//       });
//       return true;
//     } catch (err) {
//       console.log(err);
//       throw err;
//     }
//   }
//
//   async editAnnouncement(
//     announcementId: number,
//     from: StaffType,
//     to: number[],
//     priority: PriorityType,
//     createdAt: Date,
//     message: string,
//   ): Promise<boolean> {
//     try {
//       await prisma.announcement.update({
//         where: {
//           announcementId,
//         },
//         data: {
//           from,
//           to,
//           priority,
//           createdAt,
//           message,
//         },
//       });
//       return true;
//     } catch (err) {
//       console.log(err);
//       throw err;
//     }
//   }
//
//   async deleteAnnouncement(announcementId: number): Promise<boolean> {
//     try {
//       await prisma.announcement.delete({
//         where: {
//           announcementId,
//         },
//       });
//       return true;
//     } catch (err) {
//       console.log(err);
//       throw err;
//     }
//   }
// }
//
// export default AnnouncementService;

