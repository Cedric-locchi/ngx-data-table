import {Injectable, signal, WritableSignal} from '@angular/core';
import {DateTime} from 'luxon';
import {colDef, dynamic} from '../core';

@Injectable({
  providedIn: 'root'
})
export class DataTableManagerService {

  public _dataSources: WritableSignal<dynamic[]> = signal([]);

  public set dataSources(value: dynamic[]) {
    this._dataSources.set(value);
  }

  public get dataSources(): dynamic[] {
    return this._dataSources();
  }

  public getDataFromCol(col: colDef): string[] {
    return this.dataSources.map(row => {
      return this.dataFromCol(row, col);
    });
  }

  private dataFromCol(data: dynamic, col: colDef): string {
    if (data === undefined || data === null) {
      return 'non renseigné';
    }

    const value = data[col.field];

    if (value === undefined || value === null) {
      return 'non renseigné';
    }

    if (col.isDate) {
      const dateValue = typeof value === 'string' ? value : String(value);
      const date = DateTime.fromISO(dateValue).toLocaleString(DateTime.DATE_SHORT);
      return date === 'Invalid DateTime' ? 'non renseigné' : date;
    }

    return String(value);
  }

}
