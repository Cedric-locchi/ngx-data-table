import {Component, input, InputSignal, output, OutputEmitterRef} from '@angular/core';
import {colDef} from '../../../core';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {faSort} from '@fortawesome/free-solid-svg-icons';
import {NgIf} from '@angular/common';

@Component({
  selector: 'ng-list-header',
  imports: [
    FaIconComponent,
    NgIf
  ],
  templateUrl: './list-header.component.html',
  styleUrl: './list-header.component.scss'
})
export class ListHeaderComponent {

  public col: InputSignal<colDef> = input.required<colDef>();
  public f: InputSignal<boolean> = input.required<boolean>();

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
