import { Note } from "@prisma/client";
import NoteService from "../../services/implementation/noteImplementation";
import INoteService from "../../services/interface/noteInterface";

const noteService: INoteService = new NoteService();
const noteResolvers = {
  Query: {
    getNotes: async (): Promise<Note[]> => {
      return noteService.getNotes();
    },
  },
  Mutation: {
    createNote: async (
      _parent: undefined,
      {
        message,
        date,
      }: {
        message: string;
        date: string;
      },
    ): Promise<boolean> => {
      return noteService.createNote(message, date);
    },
    deleteNote: async (
      _parent: undefined,
      {
        noteId,
      }: {
        noteId: number;
      },
    ): Promise<boolean> => {
      return noteService.deleteNote(noteId);
    },
  },
};

export default noteResolvers;