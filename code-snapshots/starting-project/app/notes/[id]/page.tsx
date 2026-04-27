import { requireAuth } from "@/lib/auth";

export default async function NoteEditorPage() {
  await requireAuth();
  return <main>Note Editor</main>;
}
