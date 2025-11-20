import { ChangeDetectionStrategy, Component, computed, input, Signal } from '@angular/core';
import { headerConfigSchema } from '../../core';

@Component({
  selector: 'ng-data-table-header',
  imports: [],
  standalone: true,
  templateUrl: './data-table-header.component.html',
  styleUrls: ['./data-table-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableHeaderComponent {
  public size = input.required<number>();

  public readonly validatedSize: Signal<number> = computed(() => {
    const sizeValue = this.size();
    const result = headerConfigSchema.safeParse({ size: sizeValue });

    if (!result.success) {
      console.error('Invalid header configuration:', result.error);
      throw new Error(`Invalid header size: ${result.error.message}`);
    }

    return result.data.size;
  });
}
