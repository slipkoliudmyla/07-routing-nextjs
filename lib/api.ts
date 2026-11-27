'use server';

import { isNoteTag, type NewNote, type Note, type NoteTag } from '@/types/note';
import { NoteHubError, requestNoteHub } from './api/server';

interface FetchNotesParams {
  search: string;
  page: number;
  tag?: NoteTag;
}

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

function notePath(id: string) {
  if (typeof id !== 'string' || !id || id === '.' || id === '..') {
    throw new Error('Invalid note ID.');
  }
  return '/notes/' + encodeURIComponent(id);
}

export async function fetchNotes({ search, page, tag }: FetchNotesParams) {
  if (
    typeof search !== 'string' ||
    !Number.isSafeInteger(page) ||
    page < 1 ||
    (tag !== undefined && !isNoteTag(tag))
  ) {
    throw new Error('Invalid note filter.');
  }

  return requestNoteHub((client) =>
    client.get<FetchNotesResponse>('/notes', {
      params: { search, page, perPage: 12, tag },
    }),
  );
}

export async function createNote(note: NewNote) {
  if (
    !note ||
    typeof note.title !== 'string' ||
    typeof note.content !== 'string' ||
    !isNoteTag(note.tag)
  ) {
    throw new Error('Invalid note.');
  }

  const title = note.title.trim();
  if (title.length < 3 || title.length > 50 || note.content.length > 500) {
    throw new Error('Invalid note.');
  }

  return requestNoteHub((client) =>
    client.post<Note>('/notes', {
      title,
      content: note.content,
      tag: note.tag,
    }),
  );
}

export async function deleteNote(id: string) {
  const path = notePath(id);
  return requestNoteHub((client) => client.delete<Note>(path));
}

export async function fetchNoteById(id: string): Promise<Note | null> {
  const path = notePath(id);
  try {
    return await requestNoteHub((client) => client.get<Note>(path));
  } catch (error) {
    if (error instanceof NoteHubError && error.status === 404) return null;
    throw error;
  }
}
