import Link from "next/link";
import { notFound } from "next/navigation";

import { requireAuth } from "@/lib/auth";
import { getNoteById } from "@/lib/notes";
import DeleteNoteButton from "@/components/DeleteNoteButton";
import TipTapRenderer from "@/components/TipTapRenderer";

type Props = { params: Promise<{ id: string }> };

export default async function NoteViewPage({ params }: Props) {
  const [session, { id }] = await Promise.all([requireAuth(), params]);
  const note = getNoteById(id, session.user.id);

  if (!note) notFound();

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href={`/notes/${note.id}/edit`}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Edit
        </Link>
        <DeleteNoteButton noteId={note.id} />
      </div>
      <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
        {note.title}
      </h1>
      <TipTapRenderer contentJson={note.content_json} />
    </main>
  );
}
