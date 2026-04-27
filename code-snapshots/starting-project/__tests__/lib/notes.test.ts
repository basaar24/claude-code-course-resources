import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockQuery = vi.fn();
const mockGet = vi.fn();
const mockRun = vi.fn();

vi.mock('@/lib/db', () => ({
  query: mockQuery,
  get: mockGet,
  run: mockRun,
}));

vi.mock('nanoid', () => ({
  nanoid: vi.fn().mockReturnValue('test-slug-12345678'),
}));

// Import after mocks are set up
const {
  getNotesByUser,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  setNoteSharing,
  getPublicNote,
} = await import('@/lib/notes');

const MOCK_NOTE = {
  id: 'note-id-1',
  user_id: 'user-1',
  title: 'Test Note',
  content_json: '{}',
  is_public: 0,
  public_slug: null,
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('getNotesByUser', () => {
  it('calls query with userId and returns notes', () => {
    mockQuery.mockReturnValue([MOCK_NOTE]);
    const result = getNotesByUser('user-1');
    expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('WHERE user_id = ?'), [
      'user-1',
    ]);
    expect(result).toEqual([MOCK_NOTE]);
  });
});

describe('getNoteById', () => {
  it('calls get with id and userId', () => {
    mockGet.mockReturnValue(MOCK_NOTE);
    const result = getNoteById('note-id-1', 'user-1');
    expect(mockGet).toHaveBeenCalledWith(expect.stringContaining('WHERE id = ? AND user_id = ?'), [
      'note-id-1',
      'user-1',
    ]);
    expect(result).toEqual(MOCK_NOTE);
  });

  it('returns undefined when note not found', () => {
    mockGet.mockReturnValue(undefined);
    const result = getNoteById('missing-id', 'user-1');
    expect(result).toBeUndefined();
  });
});

describe('createNote', () => {
  it('inserts note and returns it from db', () => {
    mockGet.mockReturnValue(MOCK_NOTE);
    const result = createNote('user-1', 'Test Note', '{}');
    expect(mockRun).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO notes'),
      expect.arrayContaining(['user-1', 'Test Note', '{}']),
    );
    expect(mockGet).toHaveBeenCalledWith(
      expect.stringContaining('WHERE id = ?'),
      expect.any(Array),
    );
    expect(result).toEqual(MOCK_NOTE);
  });
});

describe('updateNote', () => {
  it('calls run with title, content, id, and userId', () => {
    updateNote('note-id-1', 'user-1', 'Updated Title', '{"updated":true}');
    expect(mockRun).toHaveBeenCalledWith(expect.stringContaining('UPDATE notes SET title = ?'), [
      'Updated Title',
      '{"updated":true}',
      'note-id-1',
      'user-1',
    ]);
  });
});

describe('deleteNote', () => {
  it('calls run with id and userId', () => {
    deleteNote('note-id-1', 'user-1');
    expect(mockRun).toHaveBeenCalledWith(
      expect.stringContaining('DELETE FROM notes WHERE id = ? AND user_id = ?'),
      ['note-id-1', 'user-1'],
    );
  });
});

describe('setNoteSharing', () => {
  it('sets is_public=1 and generates slug when isPublic=true', () => {
    mockGet.mockReturnValue({ ...MOCK_NOTE, is_public: 1, public_slug: 'test-slug-12345678' });
    const result = setNoteSharing('note-id-1', 'user-1', true);
    expect(mockRun).toHaveBeenCalledWith(expect.stringContaining('is_public = 1'), [
      'test-slug-12345678',
      'note-id-1',
      'user-1',
    ]);
    expect(result.public_slug).toBe('test-slug-12345678');
    expect(result.is_public).toBe(1);
  });

  it('sets is_public=0 and clears slug when isPublic=false', () => {
    mockGet.mockReturnValue({ ...MOCK_NOTE, is_public: 0, public_slug: null });
    const result = setNoteSharing('note-id-1', 'user-1', false);
    expect(mockRun).toHaveBeenCalledWith(
      expect.stringContaining('is_public = 0, public_slug = NULL'),
      ['note-id-1', 'user-1'],
    );
    expect(result.is_public).toBe(0);
    expect(result.public_slug).toBeNull();
  });
});

describe('getPublicNote', () => {
  it('queries by slug with is_public filter', () => {
    mockGet.mockReturnValue({ ...MOCK_NOTE, is_public: 1, public_slug: 'abc123' });
    const result = getPublicNote('abc123');
    expect(mockGet).toHaveBeenCalledWith(
      expect.stringContaining('WHERE public_slug = ? AND is_public = 1'),
      ['abc123'],
    );
    expect(result?.public_slug).toBe('abc123');
  });

  it('returns undefined when slug not found', () => {
    mockGet.mockReturnValue(undefined);
    const result = getPublicNote('nonexistent');
    expect(result).toBeUndefined();
  });
});
