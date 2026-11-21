import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { prefetchNote } from '@/lib/api/noteDetails';
import NoteDetailsClient from '../../NoteDetails.client';
import PreviewModal from './PreviewModal.client';

export default async function NotePreview({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const queryClient = await prefetchNote(id);

  return (
    <PreviewModal>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NoteDetailsClient noteId={id} preview />
      </HydrationBoundary>
    </PreviewModal>
  );
}
