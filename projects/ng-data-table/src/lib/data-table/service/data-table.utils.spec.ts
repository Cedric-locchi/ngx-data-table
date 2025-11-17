import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { updateCLassList } from './data-table.utils';

describe('data-table.utils', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    // Create a test container
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    // Clean up
    document.body.removeChild(container);
  });

  describe('updateCLassList', () => {
    it('should call callback for each element with matching class', () => {
      // Create test elements with same class
      const div1 = document.createElement('div');
      div1.classList.add('test-class', 'other-class');
      const div2 = document.createElement('div');
      div2.classList.add('test-class', 'another-class');
      const div3 = document.createElement('div');
      div3.classList.add('test-class');

      container.appendChild(div1);
      container.appendChild(div2);
      container.appendChild(div3);

      const callback = vi.fn();
      const event = {
        currentTarget: div1,
      };

      updateCLassList(event, callback);

      expect(callback).toHaveBeenCalledTimes(3);
      expect(callback).toHaveBeenCalledWith(div1);
      expect(callback).toHaveBeenCalledWith(div2);
      expect(callback).toHaveBeenCalledWith(div3);
    });

    it('should not call callback when no matching elements exist', () => {
      const div = document.createElement('div');
      div.classList.add('unique-class');
      container.appendChild(div);

      const callback = vi.fn();
      const event = {
        currentTarget: div,
      };

      // Remove the div before calling updateCLassList
      container.removeChild(div);

      updateCLassList(event, callback);

      expect(callback).not.toHaveBeenCalled();
    });

    it('should handle single element', () => {
      const div = document.createElement('div');
      div.classList.add('single-class');
      container.appendChild(div);

      const callback = vi.fn();
      const event = {
        currentTarget: div,
      };

      updateCLassList(event, callback);

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(div);
    });

    it('should use first class from classList', () => {
      const div1 = document.createElement('div');
      div1.classList.add('first-class', 'second-class', 'third-class');
      const div2 = document.createElement('div');
      div2.classList.add('first-class', 'different-class');
      const div3 = document.createElement('div');
      div3.classList.add('second-class'); // Should not match

      container.appendChild(div1);
      container.appendChild(div2);
      container.appendChild(div3);

      const callback = vi.fn();
      const event = {
        currentTarget: div1,
      };

      updateCLassList(event, callback);

      // Should only match elements with 'first-class'
      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenCalledWith(div1);
      expect(callback).toHaveBeenCalledWith(div2);
      expect(callback).not.toHaveBeenCalledWith(div3);
    });

    it('should work with callback that modifies elements', () => {
      const div1 = document.createElement('div');
      div1.classList.add('modify-test');
      const div2 = document.createElement('div');
      div2.classList.add('modify-test');

      container.appendChild(div1);
      container.appendChild(div2);

      const callback = (element: Element) => {
        element.classList.add('modified');
      };

      const event = {
        currentTarget: div1,
      };

      updateCLassList(event, callback);

      expect(div1.classList.contains('modified')).toBe(true);
      expect(div2.classList.contains('modified')).toBe(true);
    });

    it('should work with callback that removes classes', () => {
      const div1 = document.createElement('div');
      div1.classList.add('remove-test', 'to-remove');
      const div2 = document.createElement('div');
      div2.classList.add('remove-test', 'to-remove');

      container.appendChild(div1);
      container.appendChild(div2);

      const callback = (element: Element) => {
        element.classList.remove('to-remove');
      };

      const event = {
        currentTarget: div1,
      };

      updateCLassList(event, callback);

      expect(div1.classList.contains('to-remove')).toBe(false);
      expect(div2.classList.contains('to-remove')).toBe(false);
      expect(div1.classList.contains('remove-test')).toBe(true);
      expect(div2.classList.contains('remove-test')).toBe(true);
    });

    it('should handle elements with no classes gracefully', () => {
      const div = document.createElement('div');
      container.appendChild(div);

      const callback = vi.fn();
      const event = {
        currentTarget: div,
      };

      // Should not throw, but also shouldn't match anything
      expect(() => updateCLassList(event, callback)).not.toThrow();
    });

    it('should work with complex DOM structure', () => {
      const parent1 = document.createElement('div');
      const child1 = document.createElement('div');
      child1.classList.add('complex-test');
      parent1.appendChild(child1);

      const parent2 = document.createElement('div');
      const child2 = document.createElement('div');
      child2.classList.add('complex-test');
      parent2.appendChild(child2);

      container.appendChild(parent1);
      container.appendChild(parent2);

      const callback = vi.fn();
      const event = {
        currentTarget: child1,
      };

      updateCLassList(event, callback);

      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenCalledWith(child1);
      expect(callback).toHaveBeenCalledWith(child2);
    });

    it('should handle callback with multiple operations', () => {
      const div1 = document.createElement('div');
      div1.classList.add('multi-op');
      div1.setAttribute('data-test', 'initial');
      const div2 = document.createElement('div');
      div2.classList.add('multi-op');
      div2.setAttribute('data-test', 'initial');

      container.appendChild(div1);
      container.appendChild(div2);

      const callback = (element: Element) => {
        element.classList.add('processed');
        element.setAttribute('data-test', 'modified');
      };

      const event = {
        currentTarget: div1,
      };

      updateCLassList(event, callback);

      expect(div1.classList.contains('processed')).toBe(true);
      expect(div1.getAttribute('data-test')).toBe('modified');
      expect(div2.classList.contains('processed')).toBe(true);
      expect(div2.getAttribute('data-test')).toBe('modified');
    });
  });
});
