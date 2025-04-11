import { Note } from "@prisma/client";

interface INoteService {
  getNotes(): Promise<Note[]>;

  createNote(
    message: string,
    date: string,
    formattedDate: string,
  ): Promise<boolean>;

  deleteNote(noteId: number): Promise<boolean>;
}

export default INoteService;
