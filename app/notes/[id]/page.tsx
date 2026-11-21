import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { prefetchNote } from '@/lib/api/noteDetails';
import NoteDetailsClient from '../NoteDetails.client';

interface NoteDetailsProps {
  params: Promise<{ id: string }>;
}

export default async function NoteDetailsPage({ params }: NoteDetailsProps) {
  const { id } = await params;
  const queryClient = await prefetchNote(id);

  return (
    <main>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NoteDetailsClient />
      </HydrationBoundary>
    </main>
  );
}
