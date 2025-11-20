import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  InputSignal,
  OnInit,
  output,
  OutputEmitterRef,
  Signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { searchConfigSchema, searchTermSchema } from '../../core';

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

  public readonly validatedPlaceholder: Signal<string> = computed(() => {
    const placeholderValue = this.placeholder();
    const result = searchConfigSchema.safeParse({ placeholder: placeholderValue });

    if (!result.success) {
      console.error('Invalid search configuration:', result.error);
      throw new Error(`Invalid search placeholder: ${result.error.message}`);
    }

    return result.data.placeholder;
  });

  public ngOnInit(): void {
    this.searchControl.valueChanges.subscribe((value: string) => {
      if (value !== null && value !== '' && value !== undefined) {
        // Validate search term before emitting
        const result = searchTermSchema.safeParse(value);

        if (!result.success) {
          console.error('Invalid search term:', result.error);
          return; // Don't emit invalid search terms
        }

        this.searchTerm.emit(result.data);
      }
    });
  }
}
