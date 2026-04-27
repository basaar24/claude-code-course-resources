import { notFound } from "next/navigation";

import { requireAuth } from "@/lib/auth";
import { getNoteById } from "@/lib/notes";
import EditNoteForm from "@/components/EditNoteForm";

type Props = { params: Promise<{ id: string }> };

export default async function NoteEditPage({ params }: Props) {
  const [session, { id }] = await Promise.all([requireAuth(), params]);
  const note = getNoteById(id, session.user.id);

  if (!note) notFound();

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">Edit note</h1>
      <EditNoteForm note={note} />
    </main>
  );
}
