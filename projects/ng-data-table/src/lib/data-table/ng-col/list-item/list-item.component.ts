import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, inject, Input, input, InputSignal, OnInit, output, Output, OutputEmitterRef, signal, Type, viewChild, ViewContainerRef, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { faChevronDown, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { tap } from 'rxjs';
import {BaseListItemComponent, colDef, dynamic, ListManager} from '../../../core';

@Component({
	selector: 'ng-list-item',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './list-item.component.html',
	styleUrls: ['./list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListItemComponent implements AfterViewInit, OnInit {
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


	public readonly rowIsClicked: OutputEmitterRef<number> = output<number>();

	private readonly listManager: ListManager = inject(ListManager);

	public selectItem(index: number): void {
		this.rowIsClicked.emit(index);
	}

	public hoverLine(event: any): void {
		const selector = `div.${event.currentTarget.classList[0]}`.toString();
		const items = document.querySelectorAll(selector);
		items.forEach((item: Element) => {
			item.classList.add('hovered');
			if (this.isClickable()) {
				item.classList.add('clickable');
			}
		});

		const item = document.querySelector(selector);
		if(item && this.col().isClickable){
			event.toElement.classList.add('clickable');
		}
	}

	public removeHoveredLine(event: any): void {
		const selector = `div.${event.currentTarget.classList[0]}`.toString();
		const items = document.querySelectorAll(selector);
		items.forEach((item: Element) => {
			item.classList.remove('hovered');
		});
	}

	public ngOnInit(): void {
		this.listManager.store
			.pipe(
				tap((state) => {
					const row = state.data[this.index()];
					if (row) {
						const isCollapsible = row['isCollapsible'];
						this.rowStateCollapsed.set(typeof isCollapsible === 'boolean' ? isCollapsible : false);
					}
				}),
			)
			.subscribe();
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
