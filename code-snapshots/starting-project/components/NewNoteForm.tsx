'use client';

import { useActionState, useState } from 'react';
import NoteEditor from './NoteEditor';
import { createNoteAction } from '@/lib/actions';

export default function NewNoteForm() {
  const [state, action, pending] = useActionState(createNoteAction, null);
  const [contentJsonStr, setContentJsonStr] = useState('');

  return (
    <form action={action} className='flex flex-col gap-6'>
      {state?.error && (
        <p
          role='alert'
          className='rounded-md bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400'
        >
          {state.error}
        </p>
      )}

      <div className='flex flex-col gap-2'>
        <label htmlFor='title' className='text-sm font-medium text-gray-700 dark:text-gray-300'>
          Title
        </label>
        <input
          id='title'
          name='title'
          type='text'
          required
          placeholder='Note title'
          className='rounded-md border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder-gray-400 outline-none focus:border-transparent focus:ring-2 focus:ring-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-500'
        />
      </div>

      <input type='hidden' name='content_json' value={contentJsonStr} />

      <div className='flex flex-col gap-2'>
        <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>Content</label>
        <NoteEditor onChange={(json) => setContentJsonStr(JSON.stringify(json))} />
      </div>

      <button
        type='submit'
        disabled={pending}
        className='self-end rounded-md bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-700 disabled:opacity-50 transition-colors cursor-pointer dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200'
      >
        {pending ? 'Creating…' : 'Create note'}
      </button>
    </form>
  );
}
