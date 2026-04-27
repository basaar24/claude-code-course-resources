import { requireAuth } from '@/lib/auth';
import NewNoteForm from '@/components/NewNoteForm';

export default async function NewNotePage() {
  await requireAuth();
  return (
    <main className='mx-auto max-w-3xl px-6 py-10'>
      <h1 className='mb-8 text-2xl font-bold text-gray-900 dark:text-white'>New note</h1>
      <NewNoteForm />
    </main>
  );
}
