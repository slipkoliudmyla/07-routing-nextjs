import axios, { type AxiosInstance } from 'axios';
import type { Note, NewNote, NoteTag } from '@/types/note';

interface FetchNotesParams {
  search: string;
  page: number;
  tag?: NoteTag;
  signal?: AbortSignal;
}

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

const browserApi = axios.create({ baseURL: '/api', timeout: 12_000 });

export async function fetchNotes(
  { search, page, tag, signal }: FetchNotesParams,
  client: AxiosInstance = browserApi,
): Promise<FetchNotesResponse> {
  const { data } = await client.get<FetchNotesResponse>('/notes', {
    params: { search, page, perPage: 12, tag },
    signal,
  });
  return data;
}

export async function createNote(
  note: NewNote,
  client: AxiosInstance = browserApi,
): Promise<Note> {
  const { data } = await client.post<Note>('/notes', note);
  return data;
}

export async function deleteNote(
  id: string,
  client: AxiosInstance = browserApi,
): Promise<Note> {
  const { data } = await client.delete<Note>(
    '/notes/' + encodeURIComponent(id),
  );
  return data;
}

export async function fetchNoteById(
  id: string,
  signal?: AbortSignal,
  client: AxiosInstance = browserApi,
): Promise<Note> {
  const { data } = await client.get<Note>('/notes/' + encodeURIComponent(id), {
    signal,
  });
  return data;
}
