"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import NoteEditor from "./NoteEditor";

export default function NewNoteForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [contentJson, setContentJson] = useState<object | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content_json: contentJson ? JSON.stringify(contentJson) : undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Something went wrong");
        return;
      }

      const note = await res.json();
      router.push(`/notes/${note.id}`);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <p role="alert" className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Title
        </label>
        <input
          id="title"
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
          className="rounded-md border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder-gray-400 outline-none focus:border-transparent focus:ring-2 focus:ring-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-500"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Content</label>
        <NoteEditor onChange={setContentJson} />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="self-end rounded-md bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-700 disabled:opacity-50 transition-colors cursor-pointer dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200"
      >
        {loading ? "Creating…" : "Create note"}
      </button>
    </form>
  );
}
