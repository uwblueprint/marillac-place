import { Note, PrismaClient } from "@prisma/client";
import { getNow } from "../utils/formatDateTime";

const prisma = new PrismaClient();

const noteResolver = {
  Query: {
    getNotes: async (): Promise<Note[]> => {
      try {
        return await prisma.note.findMany({
          orderBy: [{ creation_date: "desc" }],
        });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Error getting notes";
        throw new Error(message);
      }
    },
  },
  Mutation: {
    createNote: async (
      _parent: undefined,
      {
        message,
      }: {
        message: string;
      }
    ): Promise<boolean> => {
      await prisma.note.create({
        data: {
          message,
          creation_date: getNow(),
        },
      });
      return true;
    },
    deleteNote: async (
      _parent: undefined,
      {
        note_id,
      }: {
        note_id: number;
      }
    ): Promise<boolean> => {
      await prisma.note.delete({
        where: {
          note_id,
        },
      });
      return true;
    },
  },
};

export default noteResolver;
