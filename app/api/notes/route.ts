import { createNote, fetchNotes } from '@/lib/api/notes';
import { getNoteHubClient, noteHubErrorResponse } from '@/lib/api/server';
import { isNoteTag } from '@/types/note';

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const page = Number(params.get('page') ?? 1);
  const tag = params.get('tag') ?? undefined;

  if (
    !Number.isSafeInteger(page) ||
    page < 1 ||
    (tag !== undefined && !isNoteTag(tag))
  ) {
    return Response.json({ message: 'Invalid note filter.' }, { status: 400 });
  }

  try {
    const notes = await fetchNotes(
      { search: params.get('search') ?? '', page, tag, signal: request.signal },
      getNoteHubClient(),
    );
    return Response.json(notes);
  } catch (error) {
    return noteHubErrorResponse(error);
  }
}

export async function POST(request: Request) {
  const note: unknown = await request.json().catch(() => null);
  if (
    !note ||
    typeof note !== 'object' ||
    !('title' in note) ||
    typeof note.title !== 'string' ||
    !('content' in note) ||
    typeof note.content !== 'string' ||
    !('tag' in note) ||
    typeof note.tag !== 'string' ||
    !isNoteTag(note.tag)
  ) {
    return Response.json({ message: 'Invalid note.' }, { status: 400 });
  }

  const title = note.title.trim();
  if (title.length < 3 || title.length > 50 || note.content.length > 500) {
    return Response.json({ message: 'Invalid note.' }, { status: 400 });
  }

  try {
    const created = await createNote(
      { title, content: note.content, tag: note.tag },
      getNoteHubClient(),
    );
    return Response.json(created, { status: 201 });
  } catch (error) {
    return noteHubErrorResponse(error);
  }
}
