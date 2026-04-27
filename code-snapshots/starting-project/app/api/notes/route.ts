import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import { createNote } from '@/lib/notes';
import { noteSchema } from '@/lib/schemas';

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const parsed = noteSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: 'Invalid request' }, { status: 400 });
  }

  const note = createNote(session.user.id, parsed.data.title, parsed.data.content_json);
  return Response.json(note, { status: 201 });
}
