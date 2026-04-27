"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import { auth } from "./auth";
import { createNote } from "./notes";

export async function signOutAction() {
  await auth.api.signOut({ headers: await headers() });
  redirect("/authenticate");
}

const createNoteSchema = z.object({
  title: z.string().min(1),
  content_json: z.string().min(1),
});

export async function createNoteAction(
  _prev: { error: string } | null,
  formData: FormData
): Promise<{ error: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Unauthorized" };

  const parsed = createNoteSchema.safeParse({
    title: formData.get("title"),
    content_json: formData.get("content_json"),
  });
  if (!parsed.success) return { error: "Title and content are required." };

  const note = createNote(session.user.id, parsed.data.title, parsed.data.content_json);
  redirect(`/notes/${note.id}`);
}
