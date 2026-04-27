import { describe, expect, it } from 'vitest';

import { noteSchema } from '@/lib/schemas';

describe('noteSchema', () => {
  it('passes with valid title and content_json', () => {
    const result = noteSchema.safeParse({ title: 'My Note', content_json: '{}' });
    expect(result.success).toBe(true);
  });

  it('fails when title is empty', () => {
    const result = noteSchema.safeParse({ title: '', content_json: '{}' });
    expect(result.success).toBe(false);
  });

  it('fails when content_json is empty', () => {
    const result = noteSchema.safeParse({ title: 'My Note', content_json: '' });
    expect(result.success).toBe(false);
  });

  it('fails when title is missing', () => {
    const result = noteSchema.safeParse({ content_json: '{}' });
    expect(result.success).toBe(false);
  });

  it('fails when content_json is missing', () => {
    const result = noteSchema.safeParse({ title: 'My Note' });
    expect(result.success).toBe(false);
  });

  it('fails when both fields are missing', () => {
    const result = noteSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
