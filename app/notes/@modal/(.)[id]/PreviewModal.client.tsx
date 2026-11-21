'use client';

import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Modal from '@/components/Modal/Modal';
import css from './NotePreview.module.css';

export default function PreviewModal({ children }: { children: ReactNode }) {
  const router = useRouter();
  const close = () => router.back();

  return (
    <Modal label="Note preview" onClose={close}>
      <button className={css.backBtn} type="button" onClick={close}>
        Close
      </button>
      {children}
    </Modal>
  );
}
