'use client';

export default function FilterNotesError({ error }: { error: Error }) {
  return (
    <main>
      <p role="alert">Could not fetch the list of notes. {error.message}</p>
    </main>
  );
}
