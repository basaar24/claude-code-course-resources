import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockGetSession = vi.fn();

vi.mock('@/lib/auth', () => ({
  auth: { api: { getSession: mockGetSession } },
}));

const mockCreateNote = vi.fn();
vi.mock('@/lib/notes', () => ({ createNote: mockCreateNote }));

vi.mock('next/headers', () => ({ headers: vi.fn().mockResolvedValue(new Headers()) }));

const { POST } = await import('@/app/api/notes/route');

const SESSION = { user: { id: 'user-1' } };

function makeRequest(body: unknown, contentType = 'application/json') {
  return new Request('http://localhost/api/notes', {
    method: 'POST',
    headers: { 'Content-Type': contentType },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

beforeEach(() => vi.clearAllMocks());

describe('POST /api/notes', () => {
  it('returns 401 when no session', async () => {
    mockGetSession.mockResolvedValue(null);
    const res = await POST(makeRequest({ title: 'T', content_json: '{}' }));
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe('Unauthorized');
  });

  it('returns 400 for malformed JSON body', async () => {
    mockGetSession.mockResolvedValue(SESSION);
    const res = await POST(makeRequest('not-json'));
    expect(res.status).toBe(400);
  });

  it('returns 400 when title is missing', async () => {
    mockGetSession.mockResolvedValue(SESSION);
    const res = await POST(makeRequest({ content_json: '{}' }));
    expect(res.status).toBe(400);
  });

  it('returns 400 when content_json is missing', async () => {
    mockGetSession.mockResolvedValue(SESSION);
    const res = await POST(makeRequest({ title: 'My Note' }));
    expect(res.status).toBe(400);
  });

  it('returns 201 with created note on success', async () => {
    mockGetSession.mockResolvedValue(SESSION);
    const note = { id: 'note-1', title: 'My Note', content_json: '{}' };
    mockCreateNote.mockReturnValue(note);
    const res = await POST(makeRequest({ title: 'My Note', content_json: '{}' }));
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body).toEqual(note);
    expect(mockCreateNote).toHaveBeenCalledWith('user-1', 'My Note', '{}');
  });
});
