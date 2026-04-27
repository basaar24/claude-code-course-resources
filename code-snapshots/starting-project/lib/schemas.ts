import { z } from 'zod';

export const noteSchema = z.object({
  title: z.string().min(1),
  content_json: z.string().min(1),
});
