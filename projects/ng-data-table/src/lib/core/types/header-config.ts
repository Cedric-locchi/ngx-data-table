import { z } from 'zod';

export const headerConfigSchema = z.object({
  size: z.number().int().nonnegative(),
});

export type HeaderConfig = z.infer<typeof headerConfigSchema>;
