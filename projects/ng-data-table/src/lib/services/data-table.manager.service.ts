import {Injectable, signal, WritableSignal} from '@angular/core';

import {DateTime} from 'luxon';
import {colDef, dynamic} from '../core';

@Injectable({
  providedIn: 'root'
})
export class DataTableManagerService {

  public _dataSources: WritableSignal<dynamic[]> = signal([]);

  set dataSources(value: dynamic[]) {
    this._dataSources.set(value);
  }

  get dataSources(): dynamic[] {
    return this._dataSources();
  }

  getDataFromCol(col: colDef): string[] {
    return this.dataSources.map(row => {
      return this.dataFromCol(row, col);
    });
  }

  private dataFromCol(data: dynamic, col: colDef): string {
    if (data === undefined || data === null) {
      return 'non renseigné';
    }
    if (col.isDate) {
      const date = DateTime.fromISO(data[col.field]).toLocaleString(DateTime.DATE_SHORT);
      return date === 'Invalid DateTime' ? 'non renseigné' : date;
    }
    return data[col.field];
  }

}
