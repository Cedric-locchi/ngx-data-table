import { colDefSchema } from "./coldef";
import { z } from 'zod';

export const sortEventSchema = z.object({
  field: z.string(),
  direction: z.enum(['asc', 'desc']),
  col: colDefSchema,
});

export type sortEvent = z.infer<typeof sortEventSchema>;
