import { Component } from '@angular/core';
import { BaseListItemComponent } from '../../../../ng-data-table/src/lib/core/base/table/base-list-item.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rating-cell',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rating-container">
      @for (star of stars; track $index) {
        <span [class]="star ? 'star filled' : 'star'">★</span>
      }
      <span class="rating-value">{{ rating }}/5</span>
    </div>
  `,
  styles: [
    `
      .rating-container {
        display: flex;
        align-items: center;
        gap: 2px;
      }

      .star {
        font-size: 18px;
        color: #ddd;
      }

      .star.filled {
        color: #ffc107;
      }

      .rating-value {
        margin-left: 8px;
        font-size: 14px;
        color: #666;
        font-weight: 500;
      }
    `,
  ],
})
export class RatingCellComponent extends BaseListItemComponent {
  get rating(): number {
    const value = this.getDataFromKey('rating');
    return typeof value === 'number' ? value : 0;
  }

  get stars(): boolean[] {
    return Array.from({ length: 5 }, (_, i) => i < this.rating);
  }
}
