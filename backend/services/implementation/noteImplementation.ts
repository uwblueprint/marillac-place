import { Note } from "@prisma/client";
import prisma from "../../prisma";
import INoteService from "../interface/noteInterface";
import { getNow } from "../../utils/formatDateTime";

class NoteService implements INoteService {
  async getNotes(): Promise<Note[]> {
    try {
      const notes = await prisma.note.findMany({
        orderBy: [{ creation_date: "desc" }],
      });
      return notes;
    } catch (err) {
      throw new Error("Something went wrong");
    }
  }

  async createNote(
    message: string,
  ): Promise<boolean> {
    try {
      await prisma.note.create({
        data: {
          message,
          creation_date: getNow(),
        },
      });
      return true;
    } catch (err) {
      throw new Error("Something went wrong.");
    }
  }

  async deleteNote(note_id: number): Promise<boolean> {
    try {
      await prisma.note.delete({
        where: {
          note_id,
        },
      });
      return true;
    } catch (err) {
      throw new Error("Something went wrong.");
    }
  }
}

export default NoteService;
