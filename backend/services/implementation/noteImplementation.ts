// import { Note } from "@prisma/client";
// import prisma from "../../prisma";
// import INoteService from "../interface/noteInterface";
//
// class NoteService implements INoteService {
//   async getNotes(): Promise<Note[]> {
//     try {
//       const notes = await prisma.note.findMany({
//         orderBy: [{ noteId: "desc" }],
//       });
//       return notes;
//     } catch (err) {
//       console.log(err);
//       throw err;
//     }
//   }
//
//   async createNote(
//     message: string,
//     date: string,
//     formattedDate: string,
//   ): Promise<boolean> {
//     try {
//       await prisma.note.create({
//         data: {
//           message,
//           date,
//           formattedDate,
//         },
//       });
//       return true;
//     } catch (err) {
//       console.log(err);
//       throw err;
//     }
//   }
//
//   async deleteNote(noteId: number): Promise<boolean> {
//     try {
//       await prisma.note.delete({
//         where: {
//           noteId,
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
// export default NoteService;
