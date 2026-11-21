import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import { fetchNotes } from '@/lib/api';
import { getNoteHubClient } from '@/lib/api/server';
import { notesKey } from '@/lib/queries';
import { isNoteTag } from '@/types/note';
import NotesClient from '../../Notes.client';

interface FilterPageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function FilterPage({ params }: FilterPageProps) {
  const { slug } = await params;
  const [filter] = slug;
  if (slug.length !== 1 || (filter !== 'all' && !isNoteTag(filter))) {
    notFound();
  }

  const tag = filter === 'all' ? undefined : filter;
  const queryClient = new QueryClient();
  const queryKey = notesKey('', 1, tag);

  await queryClient.prefetchQuery({
    queryKey,
    queryFn: ({ signal }) =>
      fetchNotes({ search: '', page: 1, tag, signal }, getNoteHubClient()),
  });

  if (queryClient.getQueryState(queryKey)?.status === 'error') {
    throw new Error('The NoteHub API did not return the list.');
  }

  return (
    <main>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NotesClient key={filter} tag={tag} />
      </HydrationBoundary>
    </main>
  );
}
