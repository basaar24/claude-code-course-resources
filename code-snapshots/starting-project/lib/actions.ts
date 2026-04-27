'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { auth } from './auth';
import { createNote, deleteNote, updateNote } from './notes';

export async function signOutAction() {
  await auth.api.signOut({ headers: await headers() });
  redirect('/authenticate');
}

const noteSchema = z.object({
  title: z.string().min(1),
  content_json: z.string().min(1),
});

export async function createNoteAction(
  _prev: { error: string } | null,
  formData: FormData,
): Promise<{ error: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: 'Unauthorized' };

  const parsed = noteSchema.safeParse({
    title: formData.get('title'),
    content_json: formData.get('content_json'),
  });
  if (!parsed.success) return { error: 'Title and content are required.' };

  const note = createNote(session.user.id, parsed.data.title, parsed.data.content_json);
  redirect(`/notes/${note.id}`);
}

export async function updateNoteAction(
  noteId: string,
  _prev: { error: string } | null,
  formData: FormData,
): Promise<{ error: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: 'Unauthorized' };

  const parsed = noteSchema.safeParse({
    title: formData.get('title'),
    content_json: formData.get('content_json'),
  });
  if (!parsed.success) return { error: 'Title and content are required.' };

  updateNote(noteId, session.user.id, parsed.data.title, parsed.data.content_json);
  redirect(`/notes/${noteId}`);
}

export async function deleteNoteAction(noteId: string): Promise<void> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect('/authenticate');
  deleteNote(noteId, session.user.id);
  redirect('/dashboard');
}
