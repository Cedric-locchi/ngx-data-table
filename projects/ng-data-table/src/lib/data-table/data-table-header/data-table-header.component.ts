import {Component, input} from '@angular/core';

@Component({
  selector: 'ng-data-table-header',
  imports: [],
  standalone: true,
  templateUrl: './data-table-header.component.html',
  styleUrl: './data-table-header.component.scss'
})
export class DataTableHeaderComponent {
  public size = input.required<number>();
}
