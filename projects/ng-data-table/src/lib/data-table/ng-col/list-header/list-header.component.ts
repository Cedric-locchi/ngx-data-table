import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  Signal,
} from '@angular/core';
import { colDef, colDefSchema } from '../../../core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faSort } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'ng-list-header',
  imports: [FaIconComponent],
  templateUrl: './list-header.component.html',
  styleUrls: ['./list-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListHeaderComponent {
  public col: InputSignal<colDef> = input.required<colDef>();
  public f: InputSignal<boolean> = input.required<boolean>();

  public readonly localCol: Signal<colDef> = computed(() => {
    const col = this.col();
    const result = colDefSchema.safeParse(col);
    if (!result.success) {
      throw new Error(`Invalid column definition: ${result.error.message}`);
    }
    return result.data;
  });

  public isSortable: OutputEmitterRef<colDef> = output<colDef>();

  protected readonly faSort = faSort;

  public sortable(col: colDef): boolean {
    if (col.isSortable) {
      return col.isSortable;
    }
    return false;
  }

  public sortByColumn(col: colDef) {
    this.isSortable.emit(col);
  }
}
