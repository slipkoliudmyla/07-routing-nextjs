import { type ReactNode, useEffect, useRef } from 'react';
import css from './Modal.module.css';

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
  label: string;
}

function Modal({ children, onClose, label }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className={css.backdrop}
      aria-label={label}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className={css.modal}>{children}</div>
    </dialog>
  );
}

export default Modal;
