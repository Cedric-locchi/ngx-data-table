import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  signal,
  viewChild,
  ViewContainerRef,
  WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { faChevronDown, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { BaseListItemComponent, colDef, dynamic, ListManager } from '../../../core';
import { RowHoverDirective } from '../../directives/row-hover.directive';

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
    this.rowIsClicked.emit({ index, col: this.col() });
  }

  public ngAfterViewInit(): void {
    const containerRef = this.container();
    const template = this.col().template;
    if (template && containerRef) {
      const ref = containerRef.createComponent<BaseListItemComponent>(template);
      ref.instance.rowId = this.index();
      ref.instance.col = this.col();
    }
  }
}
