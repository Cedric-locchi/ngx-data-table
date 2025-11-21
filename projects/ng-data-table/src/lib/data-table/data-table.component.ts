import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import {
  colDef,
  colDefSchema,
  ListManager,
  rowClicked,
  rowClickedSchema,
  sortEvent,
  sortEventSchema,
} from '../core';
import { z } from 'zod';
import { DataTableManagerService } from '../services';
import { ListItemComponent } from './ng-col/list-item/list-item.component';
import { ListHeaderComponent } from './ng-col/list-header/list-header.component';
import { nanoid } from 'nanoid';
import { DataTableInputSearchComponent } from './data-table-input-search/data-table-input-search.component';
import { FaIconComponent, IconDefinition } from '@fortawesome/angular-fontawesome';
import { faColumns } from '@fortawesome/free-solid-svg-icons';

import { ToggleComponent } from '../ui/toggle/toggle.component';

@Component({
  selector: 'ng-data-table',
  standalone: true,
  imports: [
    ListItemComponent,
    ListHeaderComponent,
    DataTableInputSearchComponent,
    FaIconComponent,
    ToggleComponent,
  ],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableComponent<T extends Record<string, unknown> = Record<string, unknown>> {
  public readonly dataSources: InputSignal<T[]> = input.required();
  public readonly colDef: InputSignal<colDef[]> = input.required();
  public readonly isStripped: InputSignal<boolean> = input(false);
  public readonly displayBorder: InputSignal<boolean> = input(false);

  public readonly rowIsClicked: OutputEmitterRef<rowClicked<T>> = output<rowClicked<T>>();
  public readonly sortDataSource: OutputEmitterRef<sortEvent> = output<sortEvent>();

  public readonly componentId: string = nanoid(10);
  public readonly dataTableManager: DataTableManagerService<T> = inject(DataTableManagerService<T>);
  public readonly listManager: ListManager<T> = inject(ListManager<T>);

  public readonly faColumns: IconDefinition = faColumns;
  public readonly showColumnMenu: WritableSignal<boolean> = signal(false);
  public readonly overriddenVisibility: WritableSignal<Record<string, boolean>> = signal({});

  public readonly localColDef: Signal<colDef[]> = computed(() => {
    const cols = this.colDef();
    const result = z.array(colDefSchema).safeParse(cols);
    if (!result.success) {
      throw new Error(`Invalid column definitions: ${result.error.message}`);
    }
    return result.data as colDef[];
  });

  public readonly colDefVisible: Signal<colDef[]> = computed(() => {
    const overrides = this.overriddenVisibility();
    return this.localColDef().filter((col: colDef) => {
      if (overrides[col.field] !== undefined) {
        return overrides[col.field];
      }
      return col.isVisible;
    });
  });
  public readonly sortDirection: Record<string, 'asc' | 'desc'> = {};

  constructor() {
    effect(() => {
      this.listManager.saveData(this.dataSources());
    });
  }

  public sortByColumn(col: colDef): void {
    const field = col.field;
    const direction = this.sortDirection[field] === 'asc' ? 'desc' : 'asc';
    this.sortDirection[field] = direction;

    const event = { field, direction, col };
    const result = sortEventSchema.safeParse(event);

    if (!result.success) {
      console.error('Invalid sort event:', result.error);
      throw new Error(`Invalid sort event: ${result.error.message}`);
    }

    this.sortDataSource.emit(result.data);
  }

  public clicked(event: { index: number; col: colDef }): void {
    const row = this.listManager.store().data[event.index];
    if (event.col.isClickable) {
      const clickEvent = { col: event.col, index: event.index, row: row };
      const result = rowClickedSchema.safeParse(clickEvent);

      if (!result.success) {
        console.error('Invalid row clicked event:', result.error);
        throw new Error(`Invalid row clicked event: ${result.error.message}`);
      }

      this.rowIsClicked.emit(result.data as rowClicked<T>);
    }
  }

  public toggleColumnMenu(): void {
    this.showColumnMenu.update((v) => !v);
  }

  public toggleColumnVisibility(col: colDef): void {
    this.overriddenVisibility.update((v) => ({
      ...v,
      [col.field]: !this.isColumnVisible(col),
    }));
  }

  public isColumnVisible(col: colDef): boolean {
    const overrides = this.overriddenVisibility();
    if (overrides[col.field] !== undefined) {
      return overrides[col.field];
    }
    return !!col.isVisible;
  }

  public closeColumnMenu(): void {
    this.showColumnMenu.set(false);
  }
}
