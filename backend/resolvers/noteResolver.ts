import { Note, PrismaClient } from "@prisma/client";
import { getNow } from "../utils/formatDateTime";

const prisma = new PrismaClient();

const noteResolver = {
  Query: {
    getNotes: async (): Promise<Note[]> => {
      return await prisma.note.findMany({
        orderBy: [{ creation_date: "desc" }],
      });
    },
  },
  Mutation: {
    createNote: async (
      _parent: undefined,
      {
        message,
      }: {
        message: string;
      },
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
      },
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
