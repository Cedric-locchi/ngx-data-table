import { z } from 'zod';

export const dynamicSchema = z.record(z.string(), z.unknown());

export type dynamic = z.infer<typeof dynamicSchema>;
