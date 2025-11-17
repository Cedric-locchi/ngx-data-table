import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject, Input,
  input,
  InputSignal,
  OnChanges,
  output,
  OutputEmitterRef,
  Signal,
  SimpleChanges,
} from '@angular/core';
import { colDef, dynamic, ListManager } from '../core';
import { DataTableManagerService } from '../services';
import { ListItemComponent } from './ng-col/list-item/list-item.component';
import { ListHeaderComponent } from './ng-col/list-header/list-header.component';

export type rowClicked = {
  col: colDef;
  index: number;
  row: dynamic;
}

export type sortEvent = {
  field: string;
  direction: 'asc' | 'desc';
  col: colDef;
}

@Component({
  selector: 'ng-data-table',
  standalone: true,
  imports: [ListItemComponent, ListHeaderComponent],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataTableComponent implements OnChanges {

  public readonly dataSources: InputSignal<dynamic[]> = input.required();
  public readonly colDef: InputSignal<colDef[]> = input.required();
  public readonly isStripped: InputSignal<boolean> = input(false);
  public readonly displayBorder: InputSignal<boolean> = input(false);

  public readonly rowIsClicked: OutputEmitterRef<rowClicked> = output<rowClicked>();
  public readonly sortDataSource: OutputEmitterRef<sortEvent> = output<sortEvent>();

  public readonly componentId: string = Math.random().toString(36).substring(7);
  public readonly dataTableManager: DataTableManagerService = inject(DataTableManagerService);
  public readonly listManager: ListManager = inject(ListManager);

  public readonly localColDef: Signal<colDef[]> = computed(() => this.colDef());
  public readonly sortDirection: { [key: string]: 'asc' | 'desc' } = {};

  public get colDefVisible(): colDef[] {
    return this.localColDef().filter((col: colDef) => col.isVisible);
  }

  public sortByColumn(col: colDef): void {
    const field = col.field;
    const direction = this.sortDirection[field] === 'asc' ? 'desc' : 'asc';
    this.sortDirection[field] = direction;
    this.sortDataSource.emit({ field, direction, col });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.listManager.saveData(changes['dataSources'].currentValue);
    this.dataTableManager.dataSources = changes['dataSources'].currentValue
  }

  public clicked(index: number): void {
    const col = this.localColDef().find((c) => c.isClickable);
    const row = this.dataTableManager.dataSources[index];
    if (col) {
      this.rowIsClicked.emit({ col: col, index: index, row: row });
    }
  }

}
