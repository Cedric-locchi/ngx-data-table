import { TestBed } from '@angular/core/testing';
import { DataTableManagerService } from './data-table.manager.service';
import { colDef, dynamic } from '../core';
import { beforeEach, describe, expect, it } from 'vitest';

describe('DataTableManagerService', () => {
  let service: DataTableManagerService;

  const mockDataSources: dynamic[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', birthDate: '1990-05-15', amount: 1000 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', birthDate: '1985-08-20', amount: 2000 },
    { id: 3, name: 'Bob Johnson', email: null, birthDate: 'invalid-date', amount: null },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataTableManagerService],
    });
    service = TestBed.inject(DataTableManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('dataSources getter and setter', () => {
    it('should set and get dataSources', () => {
      service.dataSources = mockDataSources;
      expect(service.dataSources).toEqual(mockDataSources);
    });

    it('should initialize with empty array', () => {
      expect(service.dataSources).toEqual([]);
    });

    it('should update dataSources when set multiple times', () => {
      service.dataSources = mockDataSources;
      expect(service.dataSources).toEqual(mockDataSources);

      const newData: dynamic[] = [{ id: 4, name: 'New User' }];
      service.dataSources = newData;
      expect(service.dataSources).toEqual(newData);
    });

    it('should handle empty array', () => {
      service.dataSources = [];
      expect(service.dataSources).toEqual([]);
    });
  });

  describe('getDataFromCol', () => {
    beforeEach(() => {
      service.dataSources = mockDataSources;
    });

    it('should return array of values for a given column', () => {
      const col: colDef = { headerName: 'Name', field: 'name' };
      const result = service.getDataFromCol(col);

      expect(result).toEqual(['John Doe', 'Jane Smith', 'Bob Johnson']);
    });

    it('should return "non renseigné" for null values', () => {
      const col: colDef = { headerName: 'Email', field: 'email' };
      const result = service.getDataFromCol(col);

      expect(result[2]).toBe('non renseigné');
    });

    it('should format dates when isDate is true', () => {
      const col: colDef = { headerName: 'Birth Date', field: 'birthDate', isDate: true };
      const result = service.getDataFromCol(col);

      expect(result[0]).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/); // Date format
      expect(result[1]).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
    });

    it('should return "non renseigné" for invalid dates', () => {
      const col: colDef = { headerName: 'Birth Date', field: 'birthDate', isDate: true };
      const result = service.getDataFromCol(col);

      expect(result[2]).toBe('non renseigné');
    });

    it('should convert numbers to strings', () => {
      const col: colDef = { headerName: 'Amount', field: 'amount' };
      const result = service.getDataFromCol(col);

      expect(result[0]).toBe('1000');
      expect(result[1]).toBe('2000');
    });

    it('should return "non renseigné" for null number values', () => {
      const col: colDef = { headerName: 'Amount', field: 'amount' };
      const result = service.getDataFromCol(col);

      expect(result[2]).toBe('non renseigné');
    });

    it('should handle non-existent fields', () => {
      const col: colDef = { headerName: 'Non Existent', field: 'nonExistent' };
      const result = service.getDataFromCol(col);

      expect(result).toEqual(['non renseigné', 'non renseigné', 'non renseigné']);
    });

    it('should return empty array when dataSources is empty', () => {
      service.dataSources = [];
      const col: colDef = { headerName: 'Name', field: 'name' };
      const result = service.getDataFromCol(col);

      expect(result).toEqual([]);
    });
  });

  describe('dataFromCol (private method behavior)', () => {
    beforeEach(() => {
      service.dataSources = mockDataSources;
    });

    it('should handle undefined data', () => {
      service.dataSources = [undefined as any];
      const col: colDef = { headerName: 'Name', field: 'name' };
      const result = service.getDataFromCol(col);

      expect(result[0]).toBe('non renseigné');
    });

    it('should handle null data', () => {
      service.dataSources = [null as any];
      const col: colDef = { headerName: 'Name', field: 'name' };
      const result = service.getDataFromCol(col);

      expect(result[0]).toBe('non renseigné');
    });

    it('should convert boolean to string', () => {
      service.dataSources = [{ active: true }];
      const col: colDef = { headerName: 'Active', field: 'active' };
      const result = service.getDataFromCol(col);

      expect(result[0]).toBe('true');
    });

    it('should convert object to string', () => {
      service.dataSources = [{ data: { nested: 'value' } }];
      const col: colDef = { headerName: 'Data', field: 'data' };
      const result = service.getDataFromCol(col);

      expect(result[0]).toBe('[object Object]');
    });

    it('should handle date with timezone', () => {
      service.dataSources = [{ date: '2023-05-15T10:30:00Z' }];
      const col: colDef = { headerName: 'Date', field: 'date', isDate: true };
      const result = service.getDataFromCol(col);

      expect(result[0]).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
      expect(result[0]).not.toBe('non renseigné');
    });

    it('should handle empty string', () => {
      service.dataSources = [{ name: '' }];
      const col: colDef = { headerName: 'Name', field: 'name' };
      const result = service.getDataFromCol(col);

      expect(result[0]).toBe('');
    });
  });

  describe('integration tests', () => {
    it('should handle complete workflow with multiple columns', () => {
      service.dataSources = mockDataSources;

      const nameCol: colDef = { headerName: 'Name', field: 'name' };
      const dateCol: colDef = { headerName: 'Birth Date', field: 'birthDate', isDate: true };
      const amountCol: colDef = { headerName: 'Amount', field: 'amount' };

      const names = service.getDataFromCol(nameCol);
      const dates = service.getDataFromCol(dateCol);
      const amounts = service.getDataFromCol(amountCol);

      expect(names).toHaveLength(3);
      expect(dates).toHaveLength(3);
      expect(amounts).toHaveLength(3);

      expect(names[0]).toBe('John Doe');
      expect(dates[0]).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
      expect(amounts[0]).toBe('1000');
    });

    it('should maintain signal reactivity', () => {
      const initialData: dynamic[] = [{ id: 1, name: 'Test' }];
      service.dataSources = initialData;

      expect(service._dataSources()).toEqual(initialData);

      const updatedData: dynamic[] = [{ id: 2, name: 'Updated' }];
      service.dataSources = updatedData;

      expect(service._dataSources()).toEqual(updatedData);
    });
  });
});
