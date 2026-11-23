'use client';

import { useState } from 'react';
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { createNote, deleteNote, fetchNotes } from '@/lib/api/notes';
import { noteKey, notesKey } from '@/lib/queries';
import type { NewNote, NoteTag } from '@/types/note';
import css from './Notes.module.css';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';
import SearchBox from '@/components/SearchBox/SearchBox';
import Loader from '@/components/Loader/Loader';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import EmptyMessage from '@/components/EmptyMessage/EmptyMessage';

export default function NotesClient({ tag }: { tag?: NoteTag }) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [selectedPage, setSelectedPage] = useState(1);
  const [isModalOpened, setModalOpened] = useState(false);

  const { data, isFetching, isError, isSuccess, isPlaceholderData } = useQuery({
    queryKey: notesKey(query, selectedPage, tag),
    queryFn: ({ signal }) =>
      fetchNotes({ search: query, page: selectedPage, tag, signal }),
    placeholderData: keepPreviousData,
  });

  const createNoteMutation = useMutation({
    mutationFn: (note: NewNote) => createNote(note),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['notes'] });
      handleModalClose();
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: async (deletedNote) => {
      if (
        !isPlaceholderData &&
        data?.notes.length === 1 &&
        data.notes[0].id === deletedNote.id &&
        selectedPage > 1
      ) {
        setSelectedPage((page) => page - 1);
      }
      queryClient.removeQueries({ queryKey: noteKey(deletedNote.id) });
      await queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const handleModalOpen = () => {
    setModalOpened(true);
  };

  const handleModalClose = () => {
    setModalOpened(false);
  };

  const handleSearchNotes = useDebouncedCallback((query: string) => {
    setQuery(query.trim());
    setSelectedPage(1);
  }, 300);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox
          value={search}
          onChange={(value: string) => {
            setSearch(value);
            handleSearchNotes(value);
          }}
        />
        {isSuccess && data.totalPages > 1 && (
          <Pagination
            pages={data.totalPages}
            selectedPage={selectedPage}
            onPageChange={setSelectedPage}
          />
        )}
        <button
          className={css.button}
          type="button"
          disabled={createNoteMutation.isPending}
          onClick={handleModalOpen}
        >
          Create note +
        </button>
      </header>
      {isFetching && <Loader />}
      {isSuccess && data.notes.length > 0 && (
        <NoteList
          notes={data.notes}
          onDelete={deleteNoteMutation.mutate}
          isDeleting={deleteNoteMutation.isPending || isPlaceholderData}
        />
      )}
      {isSuccess && !isPlaceholderData && data.notes.length === 0 && (
        <EmptyMessage query={query} />
      )}
      {isError && (
        <ErrorMessage message="Could not fetch the list of notes. Please try again." />
      )}
      {deleteNoteMutation.isError && (
        <ErrorMessage message="Could not delete the note. Please try again." />
      )}
      {isModalOpened && (
        <Modal label="Create note" onClose={handleModalClose}>
          <NoteForm
            onCancel={handleModalClose}
            onSubmit={async (note) => {
              await createNoteMutation.mutateAsync({
                ...note,
                title: note.title.trim(),
              });
            }}
          />
        </Modal>
      )}
    </div>
  );
}
