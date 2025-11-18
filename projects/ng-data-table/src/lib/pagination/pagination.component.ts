import { ChangeDetectionStrategy, Component, computed, input, output, Signal } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
  faAngleDoubleLeft,
  faAngleDoubleRight,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'dt-pagination',
  standalone: true,
  imports: [FaIconComponent],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  public readonly totalItems = input.required<number>();
  public readonly pageSize = input.required<number>();
  public readonly currentPage = input.required<number>();
  public readonly pageSizeOptions = input<number[]>([10, 25, 50, 100]);

  public readonly pageChange = output<number>();
  public readonly pageSizeChange = output<number>();

  public readonly totalPages: Signal<number> = computed(() => {
    return Math.ceil(this.totalItems() / this.pageSize());
  });

  public readonly startItem: Signal<number> = computed(() => {
    if (this.totalItems() === 0) return 0;
    return (this.currentPage() - 1) * this.pageSize() + 1;
  });

  public readonly endItem: Signal<number> = computed(() => {
    return Math.min(this.currentPage() * this.pageSize(), this.totalItems());
  });

  public readonly faChevronLeft = faChevronLeft;
  public readonly faChevronRight = faChevronRight;
  public readonly faAngleDoubleLeft = faAngleDoubleLeft;
  public readonly faAngleDoubleRight = faAngleDoubleRight;

  public onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.pageChange.emit(page);
    }
  }

  public onPageSizeChange(event: Event): void {
    const newSize = Number((event.target as HTMLSelectElement).value);
    this.pageSizeChange.emit(newSize);
  }
}
