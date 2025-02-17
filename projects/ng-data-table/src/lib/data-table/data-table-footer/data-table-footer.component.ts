import {Component, input} from '@angular/core';

@Component({
  selector: 'ng-data-table-footer',
  imports: [],
  templateUrl: './data-table-footer.component.html',
  styleUrl: './data-table-footer.component.scss'
})
export class DataTableFooterComponent {
  public size = input.required<number>();
}
