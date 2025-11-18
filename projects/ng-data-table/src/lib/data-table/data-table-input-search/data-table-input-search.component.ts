import {
  ChangeDetectionStrategy,
  Component,
  input,
  InputSignal,
  OnInit,
  output,
  OutputEmitterRef,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'ng-data-table-input-search',
  imports: [ReactiveFormsModule],
  templateUrl: './data-table-input-search.component.html',
  styleUrls: ['./data-table-input-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableInputSearchComponent implements OnInit {
  public readonly placeholder: InputSignal<string> = input('Rechercher...');
  public readonly searchControl: FormControl = new FormControl('');
  public readonly searchTerm: OutputEmitterRef<string> = output<string>();

  public ngOnInit(): void {
    this.searchControl.valueChanges.subscribe((value: string) => {
      if (value !== null && value !== '' && value !== undefined) {
        this.searchTerm.emit(value);
      }
    });
  }
}
