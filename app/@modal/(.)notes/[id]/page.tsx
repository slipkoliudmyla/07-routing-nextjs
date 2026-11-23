import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { prefetchNote } from '@/lib/api/noteDetails';
import NotePreview from './NotePreview.client';

export default async function NotePreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const queryClient = await prefetchNote(id);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreview id={id} />
    </HydrationBoundary>
  );
}
