import { AfterViewInit, Component, EventEmitter, inject, Input, input, InputSignal, OnInit, Output, signal, Type, ViewChild, ViewContainerRef, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { faChevronDown, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { tap } from 'rxjs';
import {BaseListItemComponent, colDef, dynamic, ListManager} from '../../../core';

@Component({
	selector: 'ng-list-item',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './list-item.component.html',
	styleUrl: './list-item.component.scss',
})
export class ListItemComponent implements AfterViewInit, OnInit {
	@ViewChild('container', { read: ViewContainerRef }) container!: ViewContainerRef;

	dataSource: InputSignal<dynamic[]> = input.required();
	index: InputSignal<number> = input.required();
	odd: InputSignal<boolean> = input.required();
	componentId: InputSignal<string> = input.required();
	item: InputSignal<string> = input.required();
	col: InputSignal<colDef> = input.required();

	first: InputSignal<boolean> = input(false);
	isCollapsible: InputSignal<boolean> = input(false);
	isStripped: InputSignal<boolean> = input(false);

	rowStateCollapsed: WritableSignal<boolean> = signal(false);
	icon: IconDefinition = faChevronDown;

	@Output()
	rowIsClicked: EventEmitter<number> = new EventEmitter<number>();

	@Input()
	isClickable = false;

	private readonly listManager: ListManager = inject(ListManager);

	selectItem(index: number) {
		this.rowIsClicked.emit(index);
	}

	hoverLine(event: any) {
		const selector = `div.${event.currentTarget.classList[0]}`.toString();
		const items = document.querySelectorAll(selector);
		items.forEach((item: Element) => {
			item.classList.add('hovered');
			if (this.isClickable) {
				item.classList.add('clickable');
			}
		});

		const item = document.querySelector(selector);
		if(item && this.col().isClickable){
			event.toElement.classList.add('clickable');
		}
	}

	removeHoveredLine(event: any) {
		const selector = `div.${event.currentTarget.classList[0]}`.toString();
		const items = document.querySelectorAll(selector);
		items.forEach((item: Element) => {
			item.classList.remove('hovered');
		});
	}

	ngOnInit() {
		this.listManager.store
			.pipe(
				tap((state) => {
					if(state.data[this.index()]){
						this.rowStateCollapsed.set(state.data[this.index()]['isCollapsible']);
					}
				}),
			)
			.subscribe();
	}

	ngAfterViewInit() {
		if (this.col().template !== undefined) {
			const ref = this.container.createComponent<BaseListItemComponent>(this.col().template as Type<BaseListItemComponent>);
			ref.instance.rowId = this.index();
			ref.instance.col = this.col();
		}
	}
}
