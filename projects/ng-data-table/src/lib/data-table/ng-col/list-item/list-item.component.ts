import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  Signal,
  signal,
  viewChild,
  ViewContainerRef,
  WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { faChevronDown, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { z } from 'zod';
import { RowHoverDirective } from '../../directives/row-hover.directive';
import {
  BaseListItemComponent,
  colDef,
  colDefSchema,
  dynamic,
  dynamicSchema,
  ListManager,
} from '../../../core';

@Component({
  selector: 'ng-list-item',
  standalone: true,
  imports: [CommonModule, RowHoverDirective],
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListItemComponent implements AfterViewInit {
  public readonly container = viewChild('container', { read: ViewContainerRef });

  public readonly isClickable: InputSignal<boolean> = input(false);
  public readonly dataSource: InputSignal<dynamic[]> = input.required();
  public readonly index: InputSignal<number> = input.required();
  public readonly odd: InputSignal<boolean> = input.required();
  public readonly componentId: InputSignal<string> = input.required();
  public readonly item: InputSignal<string> = input.required();
  public readonly col: InputSignal<colDef> = input.required();

  public readonly localDataSource: Signal<dynamic[]> = computed(() => {
    const data = this.dataSource();
    const result = z.array(dynamicSchema).safeParse(data);
    if (!result.success) {
      throw new Error(`Invalid data source: ${result.error.message}`);
    }
    return result.data;
  });

  public readonly localCol: Signal<colDef> = computed(() => {
    const col = this.col();
    const result = colDefSchema.safeParse(col);
    if (!result.success) {
      throw new Error(`Invalid column definition: ${result.error.message}`);
    }
    return result.data;
  });
  public readonly first: InputSignal<boolean> = input(false);
  public readonly isCollapsible: InputSignal<boolean> = input(false);
  public readonly isStripped: InputSignal<boolean> = input(false);

  public readonly rowStateCollapsed: WritableSignal<boolean> = signal(false);
  public readonly icon: IconDefinition = faChevronDown;

  public readonly rowIsClicked: OutputEmitterRef<{ index: number; col: colDef }> = output<{
    index: number;
    col: colDef;
  }>();

  private readonly listManager: ListManager = inject(ListManager);

  constructor() {
    effect(() => {
      const state = this.listManager.store();
      const row = state.data[this.index()];
      if (row) {
        const isCollapsible = row['isCollapsible'];
        this.rowStateCollapsed.set(typeof isCollapsible === 'boolean' ? isCollapsible : false);
      }
    });
  }

  public selectItem(index: number): void {
    this.rowIsClicked.emit({ index, col: this.localCol() });
  }

  public ngAfterViewInit(): void {
    const containerRef = this.container();
    const template = this.localCol().template;
    if (template && containerRef) {
      const ref = containerRef.createComponent<BaseListItemComponent>(template);
      ref.instance.rowId = this.index();
      ref.instance.col = this.localCol();
    }
  }
}
