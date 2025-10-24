import { Note } from "@prisma/client";

interface INoteService {
  getNotes(): Promise<Note[]>;

  createNote(
    message: string,
  ): Promise<boolean>;

  deleteNote(note_id: number): Promise<boolean>;
}

export default INoteService;
