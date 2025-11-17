import {ChangeDetectionStrategy, Component, input} from '@angular/core';

@Component({
  selector: 'ng-data-table-header',
  imports: [],
  standalone: true,
  templateUrl: './data-table-header.component.html',
  styleUrls: ['./data-table-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataTableHeaderComponent {
  public size = input.required<number>();
}
