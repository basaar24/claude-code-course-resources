import { nanoid } from 'nanoid';

import { get, query, run } from './db';

export type Note = {
  id: string;
  user_id: string;
  title: string;
  content_json: string;
  is_public: number;
  public_slug: string | null;
  created_at: string;
  updated_at: string;
};

export function getNotesByUser(userId: string): Note[] {
  return query<Note>(`SELECT * FROM notes WHERE user_id = ? ORDER BY updated_at DESC`, [userId]);
}

export function getNoteById(id: string, userId: string): Note | undefined {
  return get<Note>(`SELECT * FROM notes WHERE id = ? AND user_id = ?`, [id, userId]);
}

export function updateNote(id: string, userId: string, title: string, contentJson: string): void {
  run(
    `UPDATE notes SET title = ?, content_json = ?, updated_at = datetime('now')
     WHERE id = ? AND user_id = ?`,
    [title, contentJson, id, userId],
  );
}

export function deleteNote(id: string, userId: string): void {
  run(`DELETE FROM notes WHERE id = ? AND user_id = ?`, [id, userId]);
}

export function createNote(userId: string, title: string, contentJson: string): Note {
  const id = crypto.randomUUID();
  run(`INSERT INTO notes (id, user_id, title, content_json) VALUES (?, ?, ?, ?)`, [
    id,
    userId,
    title,
    contentJson,
  ]);
  return get<Note>(`SELECT * FROM notes WHERE id = ?`, [id])!;
}

export function setNoteSharing(id: string, userId: string, isPublic: boolean): Note {
  if (isPublic) {
    const slug = nanoid(16);
    run(
      `UPDATE notes SET is_public = 1, public_slug = ?, updated_at = datetime('now') WHERE id = ? AND user_id = ?`,
      [slug, id, userId],
    );
  } else {
    run(
      `UPDATE notes SET is_public = 0, public_slug = NULL, updated_at = datetime('now') WHERE id = ? AND user_id = ?`,
      [id, userId],
    );
  }
  return get<Note>(`SELECT * FROM notes WHERE id = ?`, [id])!;
}

export function getPublicNote(slug: string): Note | undefined {
  return get<Note>(`SELECT * FROM notes WHERE public_slug = ? AND is_public = 1`, [slug]);
}
