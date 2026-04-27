import { notFound } from "next/navigation";

import { requireAuth } from "@/lib/auth";
import { getNoteById } from "@/lib/notes";
import TipTapRenderer from "@/components/TipTapRenderer";

type Props = { params: Promise<{ id: string }> };

export default async function NoteViewPage({ params }: Props) {
  const [session, { id }] = await Promise.all([requireAuth(), params]);
  const note = getNoteById(id, session.user.id);

  if (!note) notFound();

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
        {note.title}
      </h1>
      <TipTapRenderer contentJson={note.content_json} />
    </main>
  );
}
