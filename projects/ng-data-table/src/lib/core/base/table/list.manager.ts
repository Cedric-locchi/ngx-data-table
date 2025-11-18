import { Injectable } from '@angular/core';
import { dynamic } from '../../types/dynamic';
import { BehaviorSubject } from 'rxjs';

export interface listState {
  data: dynamic[];
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
export class ListManager {
  public readonly store: BehaviorSubject<listState> = new BehaviorSubject<listState>(
    {} as listState,
  );

  constructor() {
    const state = { isCollapsed: false };
    const rowState = { field: null, isCollapsed: null, rowId: null };
    this.store.next({ data: [], state, rowState });
  }

  public saveRowState(row: rowState): void {
    const state = this.store.getValue();
    state.rowState = row;
    this.store.next(state);
  }

  public saveData(data: dynamic[]): void {
    const state = this.store.getValue();
    state.data = data;
    this.store.next(state);
  }

  public getDataByKey(key: string): unknown[] {
    return this.store.getValue().data.map((row: dynamic) => {
      return row[key];
    });
  }
}
