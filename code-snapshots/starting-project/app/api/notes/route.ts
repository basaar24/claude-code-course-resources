import { headers } from "next/headers";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { createNote } from "@/lib/notes";

const createNoteSchema = z.object({
  title: z.string().min(1),
  content_json: z.string().min(1),
});

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = createNoteSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const note = createNote(session.user.id, parsed.data.title, parsed.data.content_json);
  return Response.json(note, { status: 201 });
}
