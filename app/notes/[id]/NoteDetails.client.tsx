'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { fetchNoteById } from '@/lib/api/notes';
import { noteKey } from '@/lib/queries';
import detailsCss from './NoteDetails.module.css';
import previewCss from '@/app/@modal/(.)notes/[id]/NotePreview.module.css';

const dateFormat = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'medium',
  timeZone: 'UTC',
});

export default function NoteDetailsClient({
  noteId,
  preview = false,
}: {
  noteId?: string;
  preview?: boolean;
}) {
  const params = useParams<{ id: string }>();
  const id = noteId ?? params.id;
  const css = preview ? previewCss : detailsCss;
  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: noteKey(id),
    queryFn: ({ signal }) => fetchNoteById(id, signal),
  });

  if (isLoading) return <p role="status">Loading, please wait...</p>;
  if (isError || !note) return <p role="alert">Something went wrong.</p>;

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
        </div>
        <p className={css.tag}>{note.tag}</p>
        <p className={css.content}>{note.content}</p>
        <p className={css.date}>
          <time dateTime={note.createdAt}>
            {dateFormat.format(new Date(note.createdAt))}
          </time>
        </p>
      </div>
    </div>
  );
}
