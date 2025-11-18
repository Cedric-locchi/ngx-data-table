import { Type } from '@angular/core';
import { BaseListItemComponent } from '../base/table/base-list-item.component';
import { z } from 'zod';

export const colDefSchema = z.object({
  headerName: z.string(),
  field: z.string(),
  isVisible: z.boolean().optional(),
  isBold: z.boolean().optional(),
  isDate: z.boolean().optional(),
  isState: z.boolean().optional(),
  isEllipsis: z.boolean().optional(),
  isClickable: z.boolean().optional(),
  isSortable: z.boolean().optional(),
  template: z
    .custom<
      Type<BaseListItemComponent>
    >((val) => typeof val === 'function', { message: 'template must be an Angular component class' })
    .optional(),
});

export type colDef = z.infer<typeof colDefSchema>;
