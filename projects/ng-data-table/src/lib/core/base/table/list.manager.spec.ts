import { TestBed } from '@angular/core/testing';
import { ListManager } from './list.manager';
import { beforeEach, describe, expect, it } from 'vitest';

describe('ListManager', () => {
  let service: ListManager<Record<string, unknown>>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ListManager],
    });
    service = TestBed.inject(ListManager);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initialization', () => {
    it('should initialize with empty state', () => {
      const initialState = service.store();

      expect(initialState).toEqual({
        data: [],
        state: { isCollapsed: false },
        rowState: { field: null, isCollapsed: null, rowId: null },
      });
    });

    it('should have a writable signal store', () => {
      expect(service.store).toBeDefined();
      expect(typeof service.store).toBe('function');
    });
  });

  describe('saveData', () => {
    it('should save data to store', () => {
      const mockData = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
      ];

      service.saveData(mockData);

      expect(service.store().data).toEqual(mockData);
    });

    it('should preserve state and rowState when saving data', () => {
      const mockRowState = { field: 'name', isCollapsed: true, rowId: 1 };
      service.saveRowState(mockRowState);

      const mockData = [{ id: 1, name: 'Test' }];
      service.saveData(mockData);

      const state = service.store();
      expect(state.data).toEqual(mockData);
      expect(state.rowState).toEqual(mockRowState);
      expect(state.state.isCollapsed).toBe(false);
    });

    it('should replace existing data', () => {
      service.saveData([{ id: 1, name: 'First' }]);
      service.saveData([{ id: 2, name: 'Second' }]);

      expect(service.store().data).toEqual([{ id: 2, name: 'Second' }]);
    });

    it('should handle empty array', () => {
      service.saveData([{ id: 1 }]);
      service.saveData([]);

      expect(service.store().data).toEqual([]);
    });

    it('should maintain immutability', () => {
      const mockData = [{ id: 1, name: 'Test' }];
      service.saveData(mockData);

      const stateBefore = service.store();
      service.saveData([{ id: 2, name: 'New' }]);
      const stateAfter = service.store();

      expect(stateBefore).not.toBe(stateAfter);
    });
  });

  describe('saveRowState', () => {
    it('should save row state to store', () => {
      const mockRowState = { field: 'name', isCollapsed: true, rowId: 5 };

      service.saveRowState(mockRowState);

      expect(service.store().rowState).toEqual(mockRowState);
    });

    it('should preserve data when saving row state', () => {
      const mockData = [{ id: 1, name: 'Test' }];
      service.saveData(mockData);

      const mockRowState = { field: 'email', isCollapsed: false, rowId: 0 };
      service.saveRowState(mockRowState);

      const state = service.store();
      expect(state.data).toEqual(mockData);
      expect(state.rowState).toEqual(mockRowState);
    });

    it('should update only rowState without affecting other state', () => {
      const initialState = service.store();

      service.saveRowState({ field: 'test', isCollapsed: true, rowId: 2 });

      const updatedState = service.store();
      expect(updatedState.state).toEqual(initialState.state);
      expect(updatedState.data).toEqual(initialState.data);
      expect(updatedState.rowState).toEqual({ field: 'test', isCollapsed: true, rowId: 2 });
    });

    it('should replace previous row state', () => {
      service.saveRowState({ field: 'first', isCollapsed: true, rowId: 1 });
      service.saveRowState({ field: 'second', isCollapsed: false, rowId: 2 });

      expect(service.store().rowState).toEqual({ field: 'second', isCollapsed: false, rowId: 2 });
    });

    it('should handle null values in row state', () => {
      service.saveRowState({ field: null, isCollapsed: null, rowId: null });

      expect(service.store().rowState).toEqual({ field: null, isCollapsed: null, rowId: null });
    });
  });

  describe('getDataByKey', () => {
    beforeEach(() => {
      const mockData = [
        { id: 1, name: 'John', email: 'john@example.com', age: 30 },
        { id: 2, name: 'Jane', email: 'jane@example.com', age: 25 },
        { id: 3, name: 'Bob', email: null, age: 35 },
      ];
      service.saveData(mockData);
    });

    it('should return value for a given key and rowId', () => {
      const name = service.getDataByKey('name', 0);

      expect(name).toBe('John');
    });

    it('should return values for different keys and rowIds', () => {
      const id1 = service.getDataByKey('id', 0);
      const age2 = service.getDataByKey('age', 1);

      expect(id1).toBe(1);
      expect(age2).toBe(25);
    });

    it('should handle null values in data', () => {
      const email = service.getDataByKey('email', 2);

      expect(email).toBeNull();
    });

    it('should return undefined for non-existent keys', () => {
      const result = service.getDataByKey('nonExistent', 0);

      expect(result).toBeUndefined();
    });

    it('should return undefined when rowId does not exist', () => {
      const result = service.getDataByKey('name', 999);

      expect(result).toBeUndefined();
    });

    it('should handle nested object keys', () => {
      service.saveData([
        { id: 1, user: { name: 'John' } },
        { id: 2, user: { name: 'Jane' } },
      ]);

      const user = service.getDataByKey('user', 0);

      expect(user).toEqual({ name: 'John' });
    });

    it('should return correct values after data update', () => {
      service.saveData([{ id: 1, name: 'Updated' }]);
      const name = service.getDataByKey('name', 0);

      expect(name).toBe('Updated');
    });
  });

  describe('integration tests', () => {
    it('should handle complete workflow', () => {
      // Save initial data
      service.saveData([{ id: 1, name: 'Test' }]);
      expect(service.store().data).toHaveLength(1);

      // Save row state
      service.saveRowState({ field: 'name', isCollapsed: true, rowId: 0 });
      expect(service.store().rowState.isCollapsed).toBe(true);

      // Get data by key
      const name = service.getDataByKey('name', 0);
      expect(name).toBe('Test');

      // Update data
      service.saveData([
        { id: 1, name: 'Updated' },
        { id: 2, name: 'New' },
      ]);
      expect(service.store().data).toHaveLength(2);
      expect(service.store().rowState.isCollapsed).toBe(true); // Row state preserved
    });

    it('should maintain signal reactivity', () => {
      const initialData = [{ id: 1 }];
      service.saveData(initialData);

      const stateBefore = service.store();
      expect(stateBefore.data).toEqual(initialData);

      const updatedData = [{ id: 2 }];
      service.saveData(updatedData);

      const stateAfter = service.store();
      expect(stateAfter.data).toEqual(updatedData);
      expect(stateAfter.data).not.toEqual(stateBefore.data);
    });
  });

  describe('type safety with generics', () => {
    interface User extends Record<string, unknown> {
      id: number;
      name: string;
      email: string;
    }

    it('should work with typed data', () => {
      const typedService = TestBed.inject(ListManager) as ListManager<User>;

      const users: User[] = [
        { id: 1, name: 'John', email: 'john@example.com' },
        { id: 2, name: 'Jane', email: 'jane@example.com' },
      ];

      typedService.saveData(users);

      expect(typedService.store().data).toEqual(users);
      expect(typedService.getDataByKey('email', 0)).toBe('john@example.com');
      expect(typedService.getDataByKey('email', 1)).toBe('jane@example.com');
    });
  });
});
