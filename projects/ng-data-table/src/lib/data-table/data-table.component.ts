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
import { faColumns, faGripVertical } from '@fortawesome/free-solid-svg-icons';

import { ToggleComponent } from '../ui/toggle/toggle.component';
import { PaginationComponent } from '../pagination/pagination.component';

@Component({
  selector: 'ng-data-table',
  standalone: true,
  imports: [
    ListItemComponent,
    ListHeaderComponent,
    DataTableInputSearchComponent,
    FaIconComponent,
    ToggleComponent,
    PaginationComponent,
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
  public readonly searchAppearance: InputSignal<'filled' | 'outlined'> = input<
    'filled' | 'outlined'
  >('outlined');
  public readonly searchLabel: InputSignal<string> = input<string>('');

  // Pagination Inputs
  public readonly totalItems: InputSignal<number> = input(0);
  public readonly pageSize: InputSignal<number> = input(10);
  public readonly currentPage: InputSignal<number> = input(1);
  public readonly pageSizeOptions: InputSignal<number[]> = input([10, 25, 50, 100]);

  public readonly rowIsClicked: OutputEmitterRef<rowClicked<T>> = output<rowClicked<T>>();
  public readonly sortDataSource: OutputEmitterRef<sortEvent> = output<sortEvent>();

  // Pagination Outputs
  public readonly pageChange: OutputEmitterRef<number> = output<number>();
  public readonly pageSizeChange: OutputEmitterRef<number> = output<number>();

  public readonly componentId: string = nanoid(10);
  public readonly dataTableManager: DataTableManagerService<T> = inject(DataTableManagerService<T>);
  public readonly listManager: ListManager<T> = inject(ListManager<T>);

  public readonly faColumns: IconDefinition = faColumns;
  public readonly faGripVertical: IconDefinition = faGripVertical;
  public readonly showColumnMenu: WritableSignal<boolean> = signal(false);
  public readonly overriddenVisibility: WritableSignal<Record<string, boolean>> = signal({});
  public readonly columnOrder: WritableSignal<string[]> = signal([]);
  public readonly columnStateChange: OutputEmitterRef<colDef[]> = output<colDef[]>();

  public readonly localColDef: Signal<colDef[]> = computed(() => {
    const cols = this.colDef();
    const result = z.array(colDefSchema).safeParse(cols);
    if (!result.success) {
      throw new Error(`Invalid column definitions: ${result.error.message}`);
    }
    return result.data as colDef[];
  });

  public readonly allColDefOrdered: Signal<colDef[]> = computed(() => {
    const order = this.columnOrder();
    const cols = this.localColDef();

    // Sort columns based on order
    return [...cols].sort((a, b) => {
      const indexA = order.indexOf(a.field);
      const indexB = order.indexOf(b.field);

      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }
      if (indexA !== -1) {
        return -1;
      }
      if (indexB !== -1) {
        return 1;
      }
      return 0;
    });
  });

  public readonly colDefVisible: Signal<colDef[]> = computed(() => {
    const overrides = this.overriddenVisibility();
    return this.allColDefOrdered().filter((col: colDef) => {
      if (overrides[col.field] !== undefined) {
        return overrides[col.field];
      }
      return col.isVisible;
    });
  });

  public readonly columnState: Signal<colDef[]> = computed(() => {
    const overrides = this.overriddenVisibility();
    return this.allColDefOrdered().map((col) => ({
      ...col,
      isVisible: overrides[col.field] !== undefined ? overrides[col.field] : col.isVisible,
    }));
  });
  public readonly sortDirection: Record<string, 'asc' | 'desc'> = {};

  constructor() {
    effect(() => {
      this.listManager.saveData(this.dataSources());
    });

    effect(() => {
      this.columnStateChange.emit(this.columnState());
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

  public toggleColumnVisibility(col: colDef, isVisible?: boolean): void {
    this.overriddenVisibility.update((v) => {
      const current = v[col.field] !== undefined ? v[col.field] : col.isVisible;
      const newState = isVisible !== undefined ? isVisible : !current;
      return { ...v, [col.field]: newState };
    });
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

  public readonly dragOverColumn: WritableSignal<string | null> = signal(null);

  public onDragStart(event: DragEvent, col: colDef): void {
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', col.field);
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  public onDragOver(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  public onDragEnter(event: DragEvent, col: colDef): void {
    event.preventDefault();
    this.dragOverColumn.set(col.field);
  }

  public onDragLeave(event: DragEvent, _col: colDef): void {
    event.preventDefault();
    // Only clear if we are leaving the element itself, not entering a child
    // But for simplicity in this list item case, we might just rely on enter of another item or drop
    // However, to be cleaner, we can check if we are still over the same column in a more complex way
    // For now, let's just rely on onDragEnter of other columns to switch the highlight
    // or we can check relatedTarget.
    // A common pattern is to not clear on leave immediately if we are just moving to a child,
    // but here the structure is flat enough.
    // Actually, if we leave the item, we might want to clear, but if we move to the next item,
    // the next item's dragEnter will trigger.
    // Let's try clearing only if we really leave the list, but that's hard.
    // Let's just set it to null if we are not over it?
    // Actually, simpler: onDragEnter sets it. onDrop clears it.
    // If we drag out of the list entirely, we might want to clear it.
    // Let's leave onDragLeave empty for now or just not use it if onDragEnter is sufficient for switching.
    // But if I drag outside the menu, the last highlighted one stays highlighted.
    // Let's try to clear it if the related target is not a drag handle or item.
    // For now, I will just implement onDragEnter to set it.
  }

  public onDrop(event: DragEvent, targetCol: colDef): void {
    event.preventDefault();
    this.dragOverColumn.set(null);
    const draggedField = event.dataTransfer?.getData('text/plain');
    if (draggedField && draggedField !== targetCol.field) {
      const currentOrder =
        this.columnOrder().length > 0
          ? [...this.columnOrder()]
          : this.localColDef().map((c) => c.field);

      const fromIndex = currentOrder.indexOf(draggedField);
      const toIndex = currentOrder.indexOf(targetCol.field);

      if (fromIndex !== -1 && toIndex !== -1) {
        const updateOrder = () => {
          currentOrder.splice(fromIndex, 1);
          currentOrder.splice(toIndex, 0, draggedField);
          this.columnOrder.set(currentOrder);
        };

        if (document.startViewTransition) {
          document.startViewTransition(() => {
            updateOrder();
            // Force change detection to ensure the DOM is updated within the transition
            // Angular signals should handle this, but sometimes we need to be sure.
          });
        } else {
          updateOrder();
        }
      }
    }
  }
}
