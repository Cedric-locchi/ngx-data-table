import { Injectable, signal, WritableSignal } from '@angular/core';

export interface listState<T = Record<string, unknown>> {
  data: T[];
  state: state;
  rowState: rowState;
}

interface rowState {
  field: string | null;
  isCollapsed: boolean | null;
  rowId: number | null;
}
interface state {
  isCollapsed: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ListManager<T extends Record<string, unknown> = Record<string, unknown>> {
  public readonly store: WritableSignal<listState<T>> = signal<listState<T>>({
    data: [],
    state: { isCollapsed: false },
    rowState: { field: null, isCollapsed: null, rowId: null },
  });

  public saveRowState(row: rowState): void {
    this.store.update((state) => ({
      ...state,
      rowState: row,
    }));
  }

  public saveData(data: T[]): void {
    this.store.update((state) => ({
      ...state,
      data: data,
    }));
  }

  public getDataByKey(key: string): unknown[] {
    return this.store().data.map((row: T) => {
      return row?.[key];
    });
  }
}
