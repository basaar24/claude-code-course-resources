import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getPublicNote } from '@/lib/notes';
import TipTapRenderer from '@/components/TipTapRenderer';

type Props = { params: Promise<{ slug: string }> };

export default async function PublicNotePage({ params }: Props) {
  const { slug } = await params;
  const note = getPublicNote(slug);

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
      <h1 className='mb-4 text-3xl font-bold text-gray-900 dark:text-white'>{note.title}</h1>
      <p className='mb-6 text-xs text-gray-500 dark:text-gray-400'>
        Created {fmt(note.created_at)}
        {note.updated_at !== note.created_at && <> &middot; Updated {fmt(note.updated_at)}</>}
      </p>
      <TipTapRenderer contentJson={note.content_json} />
      <p className='mt-12 text-xs text-gray-400 dark:text-gray-600'>
        <Link href='/' className='hover:underline'>
          Notes App
        </Link>
      </p>
    </main>
  );
}
