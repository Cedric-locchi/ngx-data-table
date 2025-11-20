import { ChangeDetectionStrategy, Component, computed, input, Signal } from '@angular/core';
import { footerConfigSchema } from '../../core';

@Component({
  selector: 'ng-data-table-footer',
  imports: [],
  templateUrl: './data-table-footer.component.html',
  styleUrls: ['./data-table-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableFooterComponent {
  public size = input.required<number>();

  public readonly validatedSize: Signal<number> = computed(() => {
    const sizeValue = this.size();
    const result = footerConfigSchema.safeParse({ size: sizeValue });

    if (!result.success) {
      console.error('Invalid footer configuration:', result.error);
      throw new Error(`Invalid footer size: ${result.error.message}`);
    }

    return result.data.size;
  });
}
