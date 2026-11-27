import 'server-only';
import { QueryClient } from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import { fetchNoteById } from '@/lib/api';
import { noteKey } from '@/lib/queries';

export async function prefetchNote(id: string) {
  const queryClient = new QueryClient();
  const queryKey = noteKey(id);
  await queryClient.prefetchQuery({
    queryKey,
    queryFn: () => fetchNoteById(id),
  });

  const state = queryClient.getQueryState(queryKey);
  if (state?.status === 'error') {
    throw new Error('The NoteHub API did not return this note.');
  }
  if (state?.data === null) notFound();

  return queryClient;
}
