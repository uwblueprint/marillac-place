import { Note } from "@prisma/client";
import db from "../../prisma";

const noteResolver = {
  Query: {
    getNotes: async (): Promise<Note[]> => {
      return await db.note.findMany({
        orderBy: [{ date: "desc" }],
      });
    },
  },
  Mutation: {
    createNote: async (
      _parent: undefined,
      { message }: {
        message: string;
      }
    ): Promise<Note> => {
      return await db.note.create({
        data: { message },
      });
    },
    deleteNote: async (
      _parent: undefined,
      { nid }: {
        nid: number;
      }
    ): Promise<Note> => {
      return await db.note.delete({
        where: { nid },
      });
    },
  },
};

export default noteResolver;
