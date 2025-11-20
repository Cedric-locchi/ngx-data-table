import { z } from 'zod';

export const footerConfigSchema = z.object({
  size: z.number().int().nonnegative(),
});

export type FooterConfig = z.infer<typeof footerConfigSchema>;
