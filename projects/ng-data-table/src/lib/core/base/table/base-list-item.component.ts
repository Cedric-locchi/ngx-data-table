import {Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {BaseComponent} from '../base.component';
import {colDef} from '../../types/coldef';
import {dynamic} from '../../types/dynamic';
import {ListManager} from './list.manager';
import {tap} from 'rxjs';

@Component({
  selector: 'lib-base-list-item',
  standalone: true,
  imports: [],
  template: '',
})
export abstract class BaseListItemComponent extends BaseComponent implements OnInit {

  rowId!: number;
  col!: colDef;

  protected data: WritableSignal<dynamic[]> = signal([]);
  protected readonly listManager: ListManager = inject(ListManager);

  getDataFromKey(key: string) {
    return this.listManager.getDataByKey(key);
  }

  ngOnInit() {
    this.listManager.store
      .pipe(
        tap(state => {
          if (state.data[this.rowId]) {
            state.data[this.rowId] = Object.assign(state.data[this.rowId], {isCollapsed: false, rowId: this.rowId});
          }
          this.data.set(state.data);
        }),
      )
      .subscribe();
  }

}
