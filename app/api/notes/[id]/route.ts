import { deleteNote, fetchNoteById } from '@/lib/api';
import { getNoteHubClient, noteHubErrorResponse } from '@/lib/api/server';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: RouteContext) {
  const { id } = await params;

  try {
    const note = await fetchNoteById(id, request.signal, getNoteHubClient());
    return Response.json(note);
  } catch (error) {
    return noteHubErrorResponse(error);
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { id } = await params;

  try {
    const note = await deleteNote(id, getNoteHubClient());
    return Response.json(note);
  } catch (error) {
    return noteHubErrorResponse(error);
  }
}
