import { Component, signal } from '@angular/core';
import { DataTableComponent } from '../../../ng-data-table/src/lib/data-table/data-table.component';
import { colDef } from '../../../ng-data-table/src/lib/core/types/coldef';
import gamesData from './ressources/data.json';
import {
  DataTableHeaderComponent,
  DataTableFooterComponent,
  DataTableInputSearchComponent,
} from '../../../ng-data-table/src/public-api';
import { DateTime } from 'luxon';

interface Game {
  [key: string]: string | number | string[];
  title: string;
  description: string;
  creationDate: string;
  tags: string[];
  rating: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    DataTableComponent,
    DataTableHeaderComponent,
    DataTableFooterComponent,
    DataTableInputSearchComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  public readonly title = 'Démo NgxDataTable';
  public readonly games = signal<Game[]>(gamesData);
  public readonly colDef = signal<colDef[]>([
    {
      headerName: 'Titre',
      field: 'title',
      isVisible: true,
      isBold: true,
      isSortable: true,
      isClickable: true,
    },
    {
      headerName: 'Description',
      field: 'description',
      isVisible: true,
      isEllipsis: true,
    },
    {
      headerName: 'Date de création',
      field: 'creationDate',
      isVisible: true,
      isDate: true,
      isSortable: true,
    },
    {
      headerName: 'Tags',
      field: 'tags',
      isVisible: true,
    },
    {
      headerName: 'Note',
      field: 'rating',
      isVisible: true,
      isSortable: true,
    },
  ]);

  public onRowClick(event: unknown) {
    console.log('Ligne cliquée:', event);
  }

  public find(value: string) {
    console.log(value);
  }

  public sortDataSource(event: { field: string; direction: 'asc' | 'desc'; col: colDef }): void {
    const sortedGames = [...this.games()].sort((a: Game, b: Game) => {
      const comparison = this.compareValues(a[event.field], b[event.field], event.col.isDate);
      return event.direction === 'asc' ? comparison : -comparison;
    });

    this.games.set(sortedGames);
  }

  private compareValues(
    valueA: string | number | string[],
    valueB: string | number | string[],
    isDate?: boolean,
  ): number {
    if (isDate && typeof valueA === 'string' && typeof valueB === 'string') {
      return this.compareDates(valueA, valueB);
    }

    return this.comparePrimitives(valueA, valueB);
  }

  private compareDates(dateStringA: string, dateStringB: string): number {
    const dateA = DateTime.fromISO(dateStringA);
    const dateB = DateTime.fromISO(dateStringB);

    if (dateA < dateB) return -1;
    if (dateA > dateB) return 1;
    return 0;
  }

  private comparePrimitives(
    valueA: string | number | string[],
    valueB: string | number | string[],
  ): number {
    if (valueA < valueB) return -1;
    if (valueA > valueB) return 1;
    return 0;
  }
}
