'use client';

import { useRef, useTransition } from 'react';

import { deleteNoteAction } from '@/lib/actions';

export default function DeleteNoteButton({ noteId }: { noteId: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <button
        onClick={() => dialogRef.current?.showModal()}
        className='rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950'
      >
        Delete
      </button>

      <dialog
        ref={dialogRef}
        className='rounded-xl border border-gray-200 bg-white p-6 shadow-lg backdrop:bg-black/40 dark:border-gray-700 dark:bg-gray-900'
      >
        <h2 className='mb-2 text-lg font-semibold text-gray-900 dark:text-white'>Delete note?</h2>
        <p className='mb-6 text-sm text-gray-500 dark:text-gray-400'>This cannot be undone.</p>
        <div className='flex justify-end gap-3'>
          <button
            onClick={() => dialogRef.current?.close()}
            disabled={isPending}
            className='rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800'
          >
            Cancel
          </button>
          <button
            onClick={() => startTransition(() => deleteNoteAction(noteId))}
            disabled={isPending}
            className='rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 transition-colors'
          >
            {isPending ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </dialog>
    </>
  );
}
