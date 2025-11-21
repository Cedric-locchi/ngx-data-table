import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListItemComponent } from './list-item.component';
import { ListManager, listState } from '../../../core/base/table/list.manager';
import { colDef } from '../../../core/types/coldef';
import { Component, signal, WritableSignal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { BaseListItemComponent } from '../../../core/base/table/base-list-item.component';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('ListItemComponent', () => {
  let component: ListItemComponent;
  let fixture: ComponentFixture<ListItemComponent>;
  let mockListManager: Partial<ListManager>;
  let storeSignal: WritableSignal<listState>;

  beforeEach(async () => {
    storeSignal = signal<listState>({
      data: [],
      state: { isCollapsed: false },
      rowState: { field: null, isCollapsed: null, rowId: null },
    });

    mockListManager = {
      store: storeSignal,
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

    expect(emitSpy).toHaveBeenCalledWith({
      index: 5,
      col: component.col(),
    });
  });

  it('should update rowStateCollapsed from ListManager store reactively', () => {
    // Update the store signal with data that has isCollapsible
    storeSignal.set({
      data: [{ isCollapsible: true }],
      state: { isCollapsed: false },
      rowState: { field: null, isCollapsed: null, rowId: null },
    });

    fixture.componentRef.setInput('index', 0);
    fixture.detectChanges();

    // The effect should have run automatically and updated rowStateCollapsed
    expect(component.rowStateCollapsed()).toBe(true);
  });

  @Component({
    template: '<div class="mock-item">Mock Item</div>',
    standalone: true,
  })
  class MockItemComponent extends BaseListItemComponent {}

  it('should create component from template and set instance properties', () => {
    const colWithTemplate: colDef = {
      headerName: 'Name',
      field: 'name',
      template: MockItemComponent,
    };

    fixture.componentRef.setInput('col', colWithTemplate);
    fixture.componentRef.setInput('index', 123);

    // Trigger change detection to run ngAfterViewInit
    fixture.detectChanges();

    // Verify container is available
    expect(component.container()).toBeDefined();

    // Verify the component was created
    const mockItemDebugEl = fixture.debugElement.query(By.directive(MockItemComponent));
    expect(mockItemDebugEl).toBeTruthy();

    // Verify instance properties were set
    const mockItemInstance = mockItemDebugEl.componentInstance as MockItemComponent;
    expect(mockItemInstance.rowId).toBe(123);
    expect(mockItemInstance.col).toStrictEqual(colWithTemplate);
  });

  it('should execute BaseListItemComponent logic correctly', () => {
    const colWithTemplate: colDef = {
      headerName: 'Name',
      field: 'name',
      template: MockItemComponent,
    };

    fixture.componentRef.setInput('col', colWithTemplate);
    fixture.componentRef.setInput('index', 0);

    // Setup data in store for index 0 to trigger the if block in BaseListItemComponent effect
    storeSignal.set({
      data: [{ id: 1, name: 'Test Data' }],
      state: { isCollapsed: false },
      rowState: { field: null, isCollapsed: null, rowId: null },
    });

    fixture.detectChanges();

    const mockItemDebugEl = fixture.debugElement.query(By.directive(MockItemComponent));
    const mockItemInstance = mockItemDebugEl.componentInstance as MockItemComponent;

    // Verify getDataFromKey calls ListManager
    mockItemInstance.getDataFromKey('name');
    expect(mockListManager.getDataByKey).toHaveBeenCalledWith('name', 0);
  });
});
