import { z } from 'zod';

export const dynamicSchema = z.record(z.string(), z.unknown()).nullable();

export type dynamic = z.infer<typeof dynamicSchema>;
