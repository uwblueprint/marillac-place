import { Note } from "@prisma/client";
import NoteService from "../services/implementation/noteImplementation";
import INoteService from "../services/interface/noteInterface";

const noteService: INoteService = new NoteService();

const noteResolver = {
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
        creation_date
      }: {
        message: string;
        creation_date: string;
      },
    ): Promise<boolean> => {
      return noteService.createNote(message, creation_date);
    },
    deleteNote: async (
      _parent: undefined,
      {
        note_id,
      }: {
        note_id: number;
      },
    ): Promise<boolean> => {
      return noteService.deleteNote(note_id);
    },
  },
};

export default noteResolver;
