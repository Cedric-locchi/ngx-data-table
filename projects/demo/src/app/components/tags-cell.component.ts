import { Component } from '@angular/core';
import { BaseListItemComponent } from '../../../../ng-data-table/src/lib/core/base/table/base-list-item.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tags-cell',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tags-container">
      @for (tag of tags; track tag) {
        <span class="tag">{{ tag }}</span>
      }
    </div>
  `,
  styles: [
    `
      .tags-container {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }

      .tag {
        display: inline-block;
        padding: 4px 10px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 500;
        white-space: nowrap;
      }
    `,
  ],
})
export class TagsCellComponent extends BaseListItemComponent {
  get tags(): string[] {
    const value = this.getDataFromKey('tags');
    return Array.isArray(value) ? value : [];
  }
}
