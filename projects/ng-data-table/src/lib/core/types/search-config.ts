import { z } from 'zod';

export const searchConfigSchema = z.object({
  placeholder: z.string(),
});

export const searchTermSchema = z.string().min(1);

export type SearchConfig = z.infer<typeof searchConfigSchema>;
export type SearchTerm = z.infer<typeof searchTermSchema>;
