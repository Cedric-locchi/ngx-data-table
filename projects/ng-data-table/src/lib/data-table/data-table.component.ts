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
  Signal,
} from '@angular/core';
import { colDef, ListManager, rowClicked, sortEvent } from '../core';
import { DataTableManagerService } from '../services';
import { ListItemComponent } from './ng-col/list-item/list-item.component';
import { ListHeaderComponent } from './ng-col/list-header/list-header.component';
import { nanoid } from 'nanoid';

@Component({
  selector: 'ng-data-table',
  standalone: true,
  imports: [ListItemComponent, ListHeaderComponent],
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

  public readonly localColDef: Signal<colDef[]> = computed(() => this.colDef());
  public readonly colDefVisible: Signal<colDef[]> = computed(() =>
    this.localColDef().filter((col: colDef) => col.isVisible),
  );
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
    this.sortDataSource.emit({ field, direction, col });
  }

  public clicked(event: { index: number; col: colDef }): void {
    const row = this.listManager.store().data[event.index];
    if (event.col.isClickable) {
      this.rowIsClicked.emit({ col: event.col, index: event.index, row: row });
    }
  }
}
