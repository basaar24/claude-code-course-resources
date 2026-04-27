"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function NewNoteForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editor = useEditor({
    extensions: [StarterKit],
    immediatelyRender: false,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editor) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content_json: JSON.stringify(editor.getJSON()),
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
        <p role="alert" className="rounded-md bg-red-950 px-4 py-3 text-sm text-red-400">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="title" className="text-sm font-medium text-gray-300">
          Title
        </label>
        <input
          id="title"
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
          className="rounded-md border border-gray-700 bg-gray-900 px-4 py-2.5 text-white placeholder-gray-500 outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-300">Content</label>
        <div className="min-h-48 rounded-md border border-gray-700 bg-gray-900 px-4 py-3 text-white [&_.tiptap]:outline-none [&_.tiptap_p]:my-1">
          <EditorContent editor={editor} />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="self-end rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-gray-950 hover:bg-gray-200 disabled:opacity-50 transition-colors cursor-pointer"
      >
        {loading ? "Creating…" : "Create note"}
      </button>
    </form>
  );
}
