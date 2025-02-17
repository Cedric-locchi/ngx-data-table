import {Type} from '@angular/core';
import {BaseListItemComponent} from '../base/table/base-list-item.component';

export type colDef = {
  headerName: string;
  field: string;
  isVisible?: boolean;
  isBold?: boolean;
  isDate?: boolean;
  isState?: boolean;
  template?: Type<BaseListItemComponent>;
  isEllipsis?: boolean;
  isClickable?: boolean;
  isSortable?: boolean;
};
