import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListHeaderComponent } from './list-header.component';
import { colDef } from '../../../core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('ListHeaderComponent', () => {
  let component: ListHeaderComponent;
  let fixture: ComponentFixture<ListHeaderComponent>;

  const mockColSortable: colDef = {
    headerName: 'Name',
    field: 'name',
    isSortable: true,
  };

  const mockColNotSortable: colDef = {
    headerName: 'Email',
    field: 'email',
    isSortable: false,
  };

  const mockColWithoutSortable: colDef = {
    headerName: 'Phone',
    field: 'phone',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListHeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('col', mockColSortable);
    fixture.componentRef.setInput('f', true);
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should have required inputs', () => {
    expect(component.col).toBeDefined();
    expect(component.f).toBeDefined();
  });

  it('should have faSort icon defined', () => {
    expect(component['faSort']).toBeDefined();
  });

  describe('sortable', () => {
    it('should return true when col.isSortable is true', () => {
      const result = component.sortable(mockColSortable);
      expect(result).toBe(true);
    });

    it('should return false when col.isSortable is false', () => {
      const result = component.sortable(mockColNotSortable);
      expect(result).toBe(false);
    });

    it('should return false when col.isSortable is undefined', () => {
      const result = component.sortable(mockColWithoutSortable);
      expect(result).toBe(false);
    });
  });

  describe('sortByColumn', () => {
    it('should emit isSortable output when sortByColumn is called', () => {
      fixture.componentRef.setInput('col', mockColSortable);
      fixture.componentRef.setInput('f', true);
      fixture.detectChanges();

      const spy = vi.fn();
      component.isSortable.subscribe(spy);

      component.sortByColumn(mockColSortable);

      expect(spy).toHaveBeenCalledWith(mockColSortable);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should emit the correct column when multiple columns exist', () => {
      fixture.componentRef.setInput('col', mockColSortable);
      fixture.componentRef.setInput('f', false);
      fixture.detectChanges();

      const spy = vi.fn();
      component.isSortable.subscribe(spy);

      component.sortByColumn(mockColNotSortable);

      expect(spy).toHaveBeenCalledWith(mockColNotSortable);
    });
  });

  describe('integration', () => {
    it('should only allow sorting when col is sortable', () => {
      fixture.componentRef.setInput('col', mockColSortable);
      fixture.componentRef.setInput('f', true);
      fixture.detectChanges();

      const isSortable = component.sortable(component.col());
      expect(isSortable).toBe(true);
    });

    it('should handle non-sortable columns correctly', () => {
      fixture.componentRef.setInput('col', mockColNotSortable);
      fixture.componentRef.setInput('f', false);
      fixture.detectChanges();

      const isSortable = component.sortable(component.col());
      expect(isSortable).toBe(false);
    });
  });
});
