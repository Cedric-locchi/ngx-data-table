import { Type } from '@angular/core';
import { BaseListItemComponent } from '../base/table/base-list-item.component';
import { z } from 'zod';

// Schema complet incluant la validation du template
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
    .custom<Type<BaseListItemComponent>>(
      (val) => {
        if (typeof val !== 'function') {
          return false;
        }

        if (!val.prototype) {
          return false;
        }

        return true;
      },
      {
        message: 'template must be a valid Angular component Type extending BaseListItemComponent',
      },
    )
    .optional(),
});

export type colDef = z.infer<typeof colDefSchema>;
