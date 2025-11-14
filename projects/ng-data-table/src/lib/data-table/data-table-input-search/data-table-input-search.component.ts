import { Component, input, InputSignal, OnInit, output, Output, OutputEmitterRef } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'ng-data-table-input-search',
  imports: [ReactiveFormsModule],
  templateUrl: './data-table-input-search.component.html',
  styleUrl: './data-table-input-search.component.scss'
})
export class DataTableInputSearchComponent implements OnInit {
  placeholder: InputSignal<string> = input('Rechercher...');
  searchControl: FormControl = new FormControl('');
  searchTerm: OutputEmitterRef<string> = output<string>();

  ngOnInit() {
    this.searchControl.valueChanges.subscribe((value: string) => {
      if (value !== null && value !== '' && value !== undefined) {
        this.searchTerm.emit(value);
      }
    });
  }

}
