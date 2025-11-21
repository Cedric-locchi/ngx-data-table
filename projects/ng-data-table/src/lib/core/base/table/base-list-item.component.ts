import { Component, effect, inject, signal, WritableSignal } from '@angular/core';
import { colDef } from '../../types/coldef';
import { dynamic } from '../../types/dynamic';
import { ListManager } from './list.manager';

@Component({
  selector: 'lib-base-list-item',
  standalone: true,
  imports: [],
  template: '',
})
export abstract class BaseListItemComponent {
  public rowId!: number;
  public col!: colDef;

  protected data: WritableSignal<dynamic[]> = signal([]);
  protected readonly listManager: ListManager = inject(ListManager);

  constructor() {
    effect(() => {
      const state = this.listManager.store();
      if (state.data[this.rowId]) {
        const updatedData = [...state.data];
        updatedData[this.rowId] = {
          ...updatedData[this.rowId],
          isCollapsed: false,
          rowId: this.rowId,
        };
        this.data.set(updatedData);
      } else {
        this.data.set(state.data);
      }
    });
  }

  public getDataFromKey(key: string): unknown {
    return this.listManager.getDataByKey(key, this.rowId);
  }
}
