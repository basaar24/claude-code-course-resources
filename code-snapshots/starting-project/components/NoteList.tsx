import Link from "next/link";

import { type Note } from "@/lib/notes";

type Props = { notes: Note[] };

export default function NoteList({ notes }: Props) {
  if (notes.length === 0) {
    return (
      <div className="mt-16 flex flex-col items-center gap-3 text-center">
        <p className="text-gray-500 dark:text-gray-400">No notes yet.</p>
        <Link
          href="/notes/new"
          className="text-sm font-medium text-gray-900 underline underline-offset-4 hover:text-gray-600 dark:text-white dark:hover:text-gray-300"
        >
          Create your first note
        </Link>
      </div>
    );
  }

  return (
    <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {notes.map((note) => (
        <li key={note.id}>
          <Link
            href={`/notes/${note.id}`}
            className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
          >
            <h2 className="truncate text-base font-semibold text-gray-900 dark:text-white">
              {note.title}
            </h2>
            <time
              dateTime={note.updated_at}
              className="text-xs text-gray-500 dark:text-gray-400"
            >
              {new Date(note.updated_at).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </time>
          </Link>
        </li>
      ))}
    </ul>
  );
}
