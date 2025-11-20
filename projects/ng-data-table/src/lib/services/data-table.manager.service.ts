import { computed, inject, Injectable, Signal } from '@angular/core';
import { DateTime } from 'luxon';
import { colDef, colDefSchema, ListManager } from '../core';

@Injectable({
  providedIn: 'root',
})
export class DataTableManagerService<T extends Record<string, unknown> = Record<string, unknown>> {
  private readonly listManager = inject(ListManager<T>);

  // Computed signal qui lit depuis ListManager - source unique de vérité
  public readonly dataSources: Signal<T[]> = computed(() => this.listManager.store().data);

  public getDataFromCol(col: colDef): string[] {
    // Validate column definition
    const result = colDefSchema.safeParse(col);
    if (!result.success) {
      console.error('Invalid column definition in getDataFromCol:', result.error);
      throw new Error(`Invalid column definition: ${result.error.message}`);
    }

    return this.dataSources().map((row) => {
      return this.dataFromCol(row, result.data);
    });
  }

  private dataFromCol(data: T, col: colDef): string {
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
