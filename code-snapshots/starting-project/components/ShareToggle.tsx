'use client';

import { useState, useTransition } from 'react';

import { toggleSharingAction } from '@/lib/actions';
import { type Note } from '@/lib/notes';

export default function ShareToggle({ note }: { note: Note }) {
  const [isPublic, setIsPublic] = useState(note.is_public === 1);
  const [slug, setSlug] = useState(note.public_slug);
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  const publicUrl = slug ? `${window.location.origin}/p/${slug}` : null;

  function handleToggle() {
    const next = !isPublic;
    setIsPublic(next);
    if (!next) setSlug(null);

    startTransition(async () => {
      const result = await toggleSharingAction(note.id, next);
      if (result.error) {
        setIsPublic(!next);
        setSlug(note.public_slug);
      } else if (next) {
        setSlug(result.slug ?? null);
      }
    });
  }

  async function handleCopy() {
    if (!publicUrl) return;
    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className='mt-6 rounded-lg border border-gray-200 p-4 dark:border-gray-700'>
      <div className='flex items-center gap-3'>
        <button
          role='switch'
          aria-checked={isPublic}
          onClick={handleToggle}
          disabled={isPending}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-offset-gray-900 ${
            isPublic ? 'bg-gray-900 dark:bg-white' : 'bg-gray-200 dark:bg-gray-700'
          }`}
        >
          <span
            className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform dark:bg-gray-900 ${
              isPublic ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
        <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>Share publicly</span>
      </div>

      {isPublic && publicUrl && (
        <div className='mt-3 flex items-center gap-2'>
          <input
            readOnly
            value={publicUrl}
            className='flex-1 rounded-md border border-gray-300 bg-gray-50 px-3 py-1.5 font-mono text-xs text-gray-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400'
          />
          <button
            onClick={handleCopy}
            className='rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800'
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}
    </div>
  );
}
