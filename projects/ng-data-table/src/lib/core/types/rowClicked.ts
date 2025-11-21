import { z } from 'zod';
import { colDefSchema } from './coldef';
import { dynamicSchema } from './dynamic';

export const rowClickedSchema = z.object({
  col: colDefSchema,
  index: z.number(),
  row: dynamicSchema,
});

export interface rowClicked<T = Record<string, unknown>> {
  col: z.infer<typeof colDefSchema>;
  index: number;
  row: T;
}
