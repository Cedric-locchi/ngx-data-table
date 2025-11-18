import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListItemComponent } from './list-item.component';
import { ListManager, listState } from '../../../core/base/table/list.manager';
import { colDef } from '../../../core/types/coldef';
import { BehaviorSubject } from 'rxjs';
import { Type } from '@angular/core';
import { BaseListItemComponent } from '../../../core/base/table/base-list-item.component';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('ListItemComponent', () => {
  let component: ListItemComponent;
  let fixture: ComponentFixture<ListItemComponent>;
  let mockListManager: Partial<ListManager>;
  let storeSubject: BehaviorSubject<listState>;

  beforeEach(async () => {
    storeSubject = new BehaviorSubject<listState>({
      data: [],
      state: { isCollapsed: false },
      rowState: { field: null, isCollapsed: null, rowId: null },
    });

    mockListManager = {
      store: storeSubject,
      getDataByKey: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ListItemComponent],
      providers: [{ provide: ListManager, useValue: mockListManager }],
    }).compileComponents();

    fixture = TestBed.createComponent(ListItemComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('dataSource', [{ id: 1, name: 'Test' }]);
    fixture.componentRef.setInput('index', 0);
    fixture.componentRef.setInput('odd', false);
    fixture.componentRef.setInput('componentId', 'test-component');
    fixture.componentRef.setInput('item', 'test-item');
    fixture.componentRef.setInput('col', {
      headerName: 'Name',
      field: 'name',
      isClickable: false,
    } satisfies colDef);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values for optional inputs', () => {
    expect(component.isClickable()).toBe(false);
    expect(component.first()).toBe(false);
    expect(component.isCollapsible()).toBe(false);
    expect(component.isStripped()).toBe(false);
  });

  it('should initialize rowStateCollapsed to false', () => {
    expect(component.rowStateCollapsed()).toBe(false);
  });

  it('should emit rowIsClicked when selectItem is called', () => {
    const emitSpy = vi.fn();
    component.rowIsClicked.subscribe(emitSpy);

    component.selectItem(5);

    expect(emitSpy).toHaveBeenCalledWith(5);
  });

  it('should add hovered class on hoverLine', () => {
    const mockElement = document.createElement('div');
    mockElement.classList.add('test-class');
    document.body.appendChild(mockElement);

    const event = {
      currentTarget: mockElement,
      toElement: mockElement,
    };

    fixture.componentRef.setInput('col', {
      headerName: 'Name',
      field: 'name',
      isClickable: true,
    } satisfies colDef);

    component.hoverLine(event);

    expect(mockElement.classList.contains('hovered')).toBe(true);

    document.body.removeChild(mockElement);
  });

  it('should remove hovered class on removeHoveredLine', () => {
    const mockElement = document.createElement('div');
    mockElement.classList.add('test-class', 'hovered');
    document.body.appendChild(mockElement);

    const event = {
      currentTarget: mockElement,
    };

    component.removeHoveredLine(event);

    expect(mockElement.classList.contains('hovered')).toBe(false);

    document.body.removeChild(mockElement);
  });

  it('should update rowStateCollapsed from ListManager store on ngOnInit', () => {
    return new Promise<void>((resolve) => {
      storeSubject.next({
        data: [{ isCollapsible: true }],
        state: { isCollapsed: false },
        rowState: { field: null, isCollapsed: null, rowId: null },
      });

      fixture.componentRef.setInput('index', 0);
      component.ngOnInit();

      setTimeout(() => {
        expect(component.rowStateCollapsed()).toBe(true);
        resolve();
      }, 100);
    });
  });

  it('should handle col with template in ngAfterViewInit', () => {
    class MockTemplateComponent extends BaseListItemComponent {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      override ngOnInit(): void {}
    }

    const colWithTemplate: colDef = {
      headerName: 'Name',
      field: 'name',
      template: MockTemplateComponent as Type<BaseListItemComponent>,
    };

    fixture.componentRef.setInput('col', colWithTemplate);

    const containerRef = component.container();
    expect(containerRef).toBeUndefined();

    expect(component.col().template).toBeDefined();
    expect(component.col().template).toBe(MockTemplateComponent);
  });
});
