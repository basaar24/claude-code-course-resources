import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockGetSession = vi.fn();
const mockSignOut = vi.fn();

vi.mock('@/lib/auth', () => ({
  auth: { api: { getSession: mockGetSession, signOut: mockSignOut } },
}));

const mockCreateNote = vi.fn();
const mockUpdateNote = vi.fn();
const mockDeleteNote = vi.fn();
const mockSetNoteSharing = vi.fn();

vi.mock('@/lib/notes', () => ({
  createNote: mockCreateNote,
  updateNote: mockUpdateNote,
  deleteNote: mockDeleteNote,
  setNoteSharing: mockSetNoteSharing,
}));

const mockRedirect = vi.fn();
vi.mock('next/navigation', () => ({ redirect: mockRedirect }));

const mockRevalidatePath = vi.fn();
vi.mock('next/cache', () => ({ revalidatePath: mockRevalidatePath }));

vi.mock('next/headers', () => ({ headers: vi.fn().mockResolvedValue(new Headers()) }));

const { createNoteAction, updateNoteAction, deleteNoteAction, toggleSharingAction } =
  await import('@/lib/actions');

const SESSION = { user: { id: 'user-1', email: 'a@b.com' } };

function formData(fields: Record<string, string>) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.append(k, v);
  return fd;
}

beforeEach(() => vi.clearAllMocks());

describe('createNoteAction', () => {
  it('returns Unauthorized when no session', async () => {
    mockGetSession.mockResolvedValue(null);
    const result = await createNoteAction(null, formData({ title: 'T', content_json: '{}' }));
    expect(result).toEqual({ error: 'Unauthorized' });
    expect(mockCreateNote).not.toHaveBeenCalled();
  });

  it('returns error when title is empty', async () => {
    mockGetSession.mockResolvedValue(SESSION);
    const result = await createNoteAction(null, formData({ title: '', content_json: '{}' }));
    expect(result).toEqual({ error: 'Title and content are required.' });
  });

  it('returns error when content_json is empty', async () => {
    mockGetSession.mockResolvedValue(SESSION);
    const result = await createNoteAction(null, formData({ title: 'Title', content_json: '' }));
    expect(result).toEqual({ error: 'Title and content are required.' });
  });

  it('creates note and redirects on success', async () => {
    mockGetSession.mockResolvedValue(SESSION);
    mockCreateNote.mockReturnValue({ id: 'note-99' });
    await createNoteAction(null, formData({ title: 'My Note', content_json: '{"type":"doc"}' }));
    expect(mockCreateNote).toHaveBeenCalledWith('user-1', 'My Note', '{"type":"doc"}');
    expect(mockRedirect).toHaveBeenCalledWith('/notes/note-99');
  });
});

describe('updateNoteAction', () => {
  it('returns Unauthorized when no session', async () => {
    mockGetSession.mockResolvedValue(null);
    const result = await updateNoteAction(
      'note-1',
      null,
      formData({ title: 'T', content_json: '{}' }),
    );
    expect(result).toEqual({ error: 'Unauthorized' });
  });

  it('returns error when data is invalid', async () => {
    mockGetSession.mockResolvedValue(SESSION);
    const result = await updateNoteAction(
      'note-1',
      null,
      formData({ title: '', content_json: '' }),
    );
    expect(result).toEqual({ error: 'Title and content are required.' });
  });

  it('updates note and redirects on success', async () => {
    mockGetSession.mockResolvedValue(SESSION);
    await updateNoteAction(
      'note-1',
      null,
      formData({ title: 'Updated', content_json: '{"type":"doc"}' }),
    );
    expect(mockUpdateNote).toHaveBeenCalledWith('note-1', 'user-1', 'Updated', '{"type":"doc"}');
    expect(mockRedirect).toHaveBeenCalledWith('/notes/note-1');
  });
});

describe('deleteNoteAction', () => {
  it('redirects to /authenticate when no session', async () => {
    mockGetSession.mockResolvedValue(null);
    await deleteNoteAction('note-1');
    expect(mockRedirect).toHaveBeenCalledWith('/authenticate');
    expect(mockDeleteNote).not.toHaveBeenCalled();
  });

  it('deletes note and redirects to /dashboard on success', async () => {
    mockGetSession.mockResolvedValue(SESSION);
    await deleteNoteAction('note-1');
    expect(mockDeleteNote).toHaveBeenCalledWith('note-1', 'user-1');
    expect(mockRedirect).toHaveBeenCalledWith('/dashboard');
  });
});

describe('toggleSharingAction', () => {
  it('returns Unauthorized when no session', async () => {
    mockGetSession.mockResolvedValue(null);
    const result = await toggleSharingAction('note-1', true);
    expect(result).toEqual({ error: 'Unauthorized' });
  });

  it('enables sharing and returns slug', async () => {
    mockGetSession.mockResolvedValue(SESSION);
    mockSetNoteSharing.mockReturnValue({ public_slug: 'abc123' });
    const result = await toggleSharingAction('note-1', true);
    expect(mockSetNoteSharing).toHaveBeenCalledWith('note-1', 'user-1', true);
    expect(result).toEqual({ slug: 'abc123' });
  });

  it('disables sharing and returns null slug', async () => {
    mockGetSession.mockResolvedValue(SESSION);
    mockSetNoteSharing.mockReturnValue({ public_slug: null });
    const result = await toggleSharingAction('note-1', false);
    expect(mockSetNoteSharing).toHaveBeenCalledWith('note-1', 'user-1', false);
    expect(result).toEqual({ slug: null });
  });
});
