import {
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
import {colDef, dynamic, ListManager} from '../core';
import {DataTableManagerService} from '../services';
import {DateTime} from 'luxon';
import {ListItemComponent} from './ng-col/list-item/list-item.component';
import {ListHeaderComponent} from './ng-col/list-header/list-header.component';

type rowClicked = {
  item: string;
  col: colDef;
  index: number;
}

@Component({
  selector: 'ng-data-table',
  standalone: true,
  imports: [ListItemComponent, ListHeaderComponent],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss',

})
export class DataTableComponent implements OnChanges {

  @Input() dataSources: dynamic[] = [];

  colDef: InputSignal<colDef[]> = input.required();
  isStripped: InputSignal<boolean> = input(false);
  displayBorder: InputSignal<boolean> = input(false);

  localColDef: Signal<colDef[]> = computed(() => this.colDef());

  sortDirection: { [key: string]: 'asc' | 'desc' } = {};

  rowIsClicked: OutputEmitterRef<rowClicked> = output<rowClicked>();

  readonly componentId: string = Math.random().toString(36).substring(7);
  readonly dataTableManager: DataTableManagerService = inject(DataTableManagerService);
  readonly listManager: ListManager = inject(ListManager);

  get colDefVisible(): colDef[] {
    return this.localColDef().filter((col: colDef) => col.isVisible);
  }

  sortByColumn(col: colDef) {
    const field = col.field;
    const direction = this.sortDirection[field] === 'asc' ? 'desc' : 'asc';
    this.sortDirection[field] = direction;
    this.sortDataSource(field, direction, col);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.listManager.saveData(changes['dataSources'].currentValue);
    this.dataTableManager.dataSources = changes['dataSources'].currentValue
  }

  private sortDataSource(field: string, direction: 'asc' | 'desc', col: colDef) {
    this.dataSources.sort((a, b) => {
      let comparison: number;
      if (col.isDate) {
        const dateA = DateTime.fromISO(a[field]);
        const dateB = DateTime.fromISO(b[field]);
        comparison = dateA < dateB ? -1 : dateA > dateB ? 1 : 0;
      } else {
        comparison = a[field] < b[field] ? -1 : a[field] > b[field] ? 1 : 0;
      }
      return direction === 'asc' ? comparison : -comparison;
    });

    this.listManager.saveData([...this.dataSources]);
    this.dataTableManager.dataSources = [...this.dataSources];
  }

}
