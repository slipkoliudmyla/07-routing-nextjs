import 'server-only';
import { QueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { notFound } from 'next/navigation';
import { fetchNoteById } from '@/lib/api';
import { noteKey } from '@/lib/queries';
import { getNoteHubClient } from './server';

export async function prefetchNote(id: string) {
  const queryClient = new QueryClient();
  const queryKey = noteKey(id);
  await queryClient.prefetchQuery({
    queryKey,
    queryFn: ({ signal }) => fetchNoteById(id, signal, getNoteHubClient()),
  });

  const state = queryClient.getQueryState(queryKey);
  if (state?.status === 'error') {
    if (isAxiosError(state.error) && state.error.response?.status === 404) {
      notFound();
    }
    throw new Error('The NoteHub API did not return this note.');
  }

  return queryClient;
}
