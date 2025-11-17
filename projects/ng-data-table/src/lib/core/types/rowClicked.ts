import { z } from 'zod';
import { colDefSchema } from "./coldef";
import { dynamicSchema } from "./dynamic";

export const rowClickedSchema = z.object({
  col: colDefSchema,
  index: z.number(),
  row: dynamicSchema,
});

export type rowClicked = z.infer<typeof rowClickedSchema>;

