import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataTableComponent } from './data-table.component';
import { colDef, dynamic, ListManager } from '../core';
import { DataTableManagerService } from '../services';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('DataTableComponent', () => {
  let component: DataTableComponent;
  let fixture: ComponentFixture<DataTableComponent>;
  let listManager: ListManager;

  const mockColDefs: colDef[] = [
    { headerName: 'Name', field: 'name', isVisible: true, isSortable: true },
    { headerName: 'Email', field: 'email', isVisible: true },
    { headerName: 'Hidden', field: 'hidden', isVisible: false },
    { headerName: 'Action', field: 'action', isVisible: true, isClickable: true },
  ];

  const mockDataSources: dynamic[] = [
    { name: 'John Doe', email: 'john@example.com', hidden: 'secret', action: 'edit' },
    { name: 'Jane Smith', email: 'jane@example.com', hidden: 'secret2', action: 'delete' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataTableComponent],
      providers: [DataTableManagerService, ListManager],
    }).compileComponents();

    fixture = TestBed.createComponent(DataTableComponent);
    component = fixture.componentInstance;
    listManager = TestBed.inject(ListManager);

    fixture.componentRef.setInput('dataSources', mockDataSources);
    fixture.componentRef.setInput('colDef', mockColDefs);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have required inputs', () => {
    expect(component.dataSources).toBeDefined();
    expect(component.colDef).toBeDefined();
  });

  it('should have optional inputs with default values', () => {
    expect(component.isStripped()).toBe(false);
    expect(component.displayBorder()).toBe(false);
  });

  it('should generate a unique componentId', () => {
    fixture.detectChanges();
    expect(component.componentId).toBeTruthy();
    expect(component.componentId.length).toBe(10);
  });

  it('should inject DataTableManagerService and ListManager', () => {
    expect(component.dataTableManager).toBeDefined();
    expect(component.listManager).toBeDefined();
  });

  describe('localColDef', () => {
    it('should compute colDef from input', () => {
      fixture.detectChanges();
      const result = component.localColDef();
      expect(result).toEqual(mockColDefs);
    });
  });

  describe('colDefVisible', () => {
    it('should return only visible columns', () => {
      fixture.detectChanges();
      const visibleCols = component.colDefVisible();
      expect(visibleCols).toHaveLength(3);
      expect(visibleCols.every((col) => col.isVisible)).toBe(true);
      expect(visibleCols.find((col) => col.field === 'hidden')).toBeUndefined();
    });
  });

  describe('sortByColumn', () => {
    it('should toggle sort direction from asc to desc', () => {
      fixture.detectChanges();
      const spy = vi.fn();
      component.sortDataSource.subscribe(spy);

      const col = mockColDefs[0];
      component.sortByColumn(col);

      expect(component.sortDirection['name']).toBe('asc');
      expect(spy).toHaveBeenCalledWith({
        field: 'name',
        direction: 'asc',
        col: col,
      });
    });

    it('should toggle sort direction from desc to asc', () => {
      fixture.detectChanges();
      component.sortDirection['name'] = 'asc';

      const spy = vi.fn();
      component.sortDataSource.subscribe(spy);

      const col = mockColDefs[0];
      component.sortByColumn(col);

      expect(component.sortDirection['name']).toBe('desc');
      expect(spy).toHaveBeenCalledWith({
        field: 'name',
        direction: 'desc',
        col: col,
      });
    });

    it('should emit sortDataSource event', () => {
      fixture.detectChanges();
      const spy = vi.fn();
      component.sortDataSource.subscribe(spy);

      const col = mockColDefs[0];
      component.sortByColumn(col);

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('data synchronization', () => {
    it('should synchronize data to ListManager via effect', () => {
      const newData: dynamic[] = [{ id: 99, name: 'New Data' }];

      fixture.componentRef.setInput('dataSources', newData);
      fixture.detectChanges();

      expect(listManager.store().data).toEqual(newData);
    });
  });

  describe('clicked', () => {
    it('should emit rowIsClicked with correct data when clickable column exists', () => {
      fixture.detectChanges();
      listManager.saveData(mockDataSources);

      const spy = vi.fn();
      component.rowIsClicked.subscribe(spy);

      component.clicked({ index: 0, col: mockColDefs[3] }); // Use the clickable column

      expect(spy).toHaveBeenCalledWith({
        col: mockColDefs[3], // The clickable column
        index: 0,
        row: mockDataSources[0],
      });
    });

    it('should not emit rowIsClicked when column is not clickable', () => {
      const mockColDefs: colDef[] = [
        { headerName: 'Name', field: 'name', isVisible: true },
        { headerName: 'Email', field: 'email', isVisible: true },
      ];

      fixture.componentRef.setInput('colDef', mockColDefs);
      fixture.detectChanges();
      listManager.saveData(mockDataSources);

      const spy = vi.fn();
      component.rowIsClicked.subscribe(spy);

      component.clicked({ index: 0, col: mockColDefs[0] });

      expect(spy).not.toHaveBeenCalled();
    });

    it('should emit with correct index for different rows', () => {
      fixture.detectChanges();
      listManager.saveData(mockDataSources);

      const spy = vi.fn();
      component.rowIsClicked.subscribe(spy);

      component.clicked({ index: 1, col: mockColDefs[3] }); // Use the clickable column

      expect(spy).toHaveBeenCalledWith({
        col: mockColDefs[3], // The clickable column
        index: 1,
        row: mockDataSources[1],
      });
    });
  });

  describe('integration', () => {
    it('should handle complete workflow from input to output', () => {
      fixture.componentRef.setInput('isStripped', true);
      fixture.componentRef.setInput('displayBorder', true);
      fixture.detectChanges();

      expect(component.isStripped()).toBe(true);
      expect(component.displayBorder()).toBe(true);
      expect(component.colDefVisible()).toHaveLength(3);
    });

    it('should maintain sort direction across multiple sorts', () => {
      fixture.detectChanges();
      const col = mockColDefs[0];

      component.sortByColumn(col); // asc
      expect(component.sortDirection['name']).toBe('asc');

      component.sortByColumn(col); // desc
      expect(component.sortDirection['name']).toBe('desc');

      component.sortByColumn(col); // asc again
      expect(component.sortDirection['name']).toBe('asc');
    });
  });
});
