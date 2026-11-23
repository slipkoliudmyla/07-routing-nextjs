'use client';

import { useRouter } from 'next/navigation';
import NoteDetailsClient from '@/app/notes/[id]/NoteDetails.client';
import Modal from '@/components/Modal/Modal';
import css from './NotePreview.module.css';

export default function NotePreview({ id }: { id: string }) {
  const router = useRouter();
  const close = () => router.back();

  return (
    <Modal label="Note preview" onClose={close}>
      <button className={css.backBtn} type="button" onClick={close}>
        Close
      </button>
      <NoteDetailsClient noteId={id} preview />
    </Modal>
  );
}
