import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ng-data-table-footer',
  imports: [],
  templateUrl: './data-table-footer.component.html',
  styleUrls: ['./data-table-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableFooterComponent {
  public size = input.required<number>();
}
