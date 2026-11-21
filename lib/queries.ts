import type { NoteTag } from '@/types/note';

export const notesKey = (search: string, page: number, tag?: NoteTag) =>
  ['notes', search, page, tag] as const;

export const noteKey = (id: string) => ['note', id] as const;
