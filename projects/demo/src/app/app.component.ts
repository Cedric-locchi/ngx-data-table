import { Component, signal, OnInit, computed } from '@angular/core';
import { DataTableComponent } from '../../../ng-data-table/src/lib/data-table/data-table.component';
import { colDef } from '../../../ng-data-table/src/lib/core/types/coldef';
import gamesData from './ressources/data.json';
import { DateTime } from 'luxon';
import { RatingCellComponent } from './components/rating-cell.component';
import { TagsCellComponent } from './components/tags-cell.component';

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
  imports: [DataTableComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  public readonly title = 'NgxDataTable Demo';
  public readonly allGames = signal<Game[]>(gamesData);
  public readonly currentPage = signal(1);
  public readonly pageSize = signal(10);

  public readonly paginatedGames = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return this.allGames().slice(start, end);
  });

  public readonly colDef = signal<colDef[]>([
    {
      headerName: 'Title',
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
      headerName: 'Creation Date',
      field: 'creationDate',
      isVisible: true,
      isDate: true,
      isSortable: true,
    },
    {
      headerName: 'Tags',
      field: 'tags',
      isVisible: true,
      template: TagsCellComponent, // Custom component for tags
    },
    {
      headerName: 'Rating',
      field: 'rating',
      isVisible: true,
      isSortable: true,
      template: RatingCellComponent, // Custom component for rating
    },
  ]);

  public onRowClick(event: unknown) {
    console.log('Row clicked:', event);
  }

  public find(value: string) {
    console.log('Search term:', value);
    // Implement search logic here
  }

  public sortDataSource(event: { field: string; direction: 'asc' | 'desc'; col: colDef }): void {
    const sortedGames = [...this.allGames()].sort((a: Game, b: Game) => {
      const comparison = this.compareValues(a[event.field], b[event.field], event.col.isDate);
      return event.direction === 'asc' ? comparison : -comparison;
    });

    this.allGames.set(sortedGames);
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

  public onColumnStateChange(columns: colDef[]): void {
    console.log('Column state changed:', columns);
  }

  public ngOnInit(): void {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (!currentTheme) {
      document.documentElement.setAttribute('data-theme', 'modern');
    }
  }

  public toggleTheme(): void {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    let newTheme = 'material';

    if (currentTheme === 'material') {
      newTheme = 'modern';
    } else {
      newTheme = 'material';
    }

    document.documentElement.setAttribute('data-theme', newTheme);
  }

  public onPageChange(page: number): void {
    this.currentPage.set(page);
  }

  public onPageSizeChange(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(1); // Reset to first page when size changes
  }
}
