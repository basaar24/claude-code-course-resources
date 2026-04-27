import Link from 'next/link';
import { notFound } from 'next/navigation';

import { requireAuth } from '@/lib/auth';
import { getNoteById } from '@/lib/notes';
import DeleteNoteButton from '@/components/DeleteNoteButton';
import ShareToggle from '@/components/ShareToggle';
import TipTapRenderer from '@/components/TipTapRenderer';

type Props = { params: Promise<{ id: string }> };

export default async function NoteViewPage({ params }: Props) {
  const [session, { id }] = await Promise.all([requireAuth(), params]);
  const note = getNoteById(id, session.user.id);

  if (!note) notFound();

  const fmt = (dt: string) =>
    new Date(dt.replace(' ', 'T') + 'Z').toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <main className='mx-auto max-w-3xl px-6 py-10'>
      <div className='mb-6 flex items-center gap-3'>
        <Link
          href={`/notes/${note.id}/edit`}
          className='rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800'
        >
          Edit
        </Link>
        <DeleteNoteButton noteId={note.id} />
      </div>
      <h1 className='mb-4 text-3xl font-bold text-gray-900 dark:text-white'>{note.title}</h1>
      <p className='mb-6 text-xs text-gray-500 dark:text-gray-400'>
        Created {fmt(note.created_at)}
        {note.updated_at !== note.created_at && <> &middot; Updated {fmt(note.updated_at)}</>}
      </p>
      <TipTapRenderer contentJson={note.content_json} />
      <ShareToggle note={note} />
    </main>
  );
}
