import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RowHoverDirective } from './row-hover.directive';
import { beforeEach, describe, expect, it } from 'vitest';

@Component({
  standalone: true,
  imports: [RowHoverDirective],
  template: ` <div ngRowHover [isClickable]="isClickable" data-testid="hover-element"></div> `,
})
class TestComponent {
  isClickable = false;
}

describe('RowHoverDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let element: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.query(By.css('[data-testid="hover-element"]'));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(element).toBeTruthy();
  });

  it('should not have hovered class initially', () => {
    expect(element.nativeElement.classList.contains('hovered')).toBe(false);
  });

  it('should not have clickable class initially', () => {
    expect(element.nativeElement.classList.contains('clickable')).toBe(false);
  });

  it('should add hovered class on mouseenter', () => {
    // Add the row class pattern that the directive looks for
    element.nativeElement.classList.add('col-0-test123');

    element.nativeElement.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();

    expect(element.nativeElement.classList.contains('hovered')).toBe(true);
  });

  it('should remove hovered class on mouseleave', () => {
    // Add the row class pattern
    element.nativeElement.classList.add('col-0-test123');

    // First hover
    element.nativeElement.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();
    expect(element.nativeElement.classList.contains('hovered')).toBe(true);

    // Then leave
    element.nativeElement.dispatchEvent(new MouseEvent('mouseleave'));
    fixture.detectChanges();
    expect(element.nativeElement.classList.contains('hovered')).toBe(false);
  });

  it('should add clickable class when isClickable is true and hovered', () => {
    component.isClickable = true;
    fixture.detectChanges();

    // Add the row class pattern
    element.nativeElement.classList.add('col-0-test123');

    element.nativeElement.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();

    expect(element.nativeElement.classList.contains('hovered')).toBe(true);
    expect(element.nativeElement.classList.contains('clickable')).toBe(true);
  });

  it('should not add clickable class when isClickable is false', () => {
    component.isClickable = false;
    fixture.detectChanges();

    // Add the row class pattern
    element.nativeElement.classList.add('col-0-test123');

    element.nativeElement.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();

    expect(element.nativeElement.classList.contains('hovered')).toBe(true);
    expect(element.nativeElement.classList.contains('clickable')).toBe(false);
  });

  it('should remove clickable class on mouseleave', () => {
    component.isClickable = true;
    fixture.detectChanges();

    // Add the row class pattern
    element.nativeElement.classList.add('col-0-test123');

    // Hover
    element.nativeElement.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();
    expect(element.nativeElement.classList.contains('clickable')).toBe(true);

    // Leave
    element.nativeElement.dispatchEvent(new MouseEvent('mouseleave'));
    fixture.detectChanges();
    expect(element.nativeElement.classList.contains('clickable')).toBe(false);
  });

  it('should toggle hovered state multiple times', () => {
    // Add the row class pattern
    element.nativeElement.classList.add('col-0-test123');

    // First hover
    element.nativeElement.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();
    expect(element.nativeElement.classList.contains('hovered')).toBe(true);

    // Leave
    element.nativeElement.dispatchEvent(new MouseEvent('mouseleave'));
    fixture.detectChanges();
    expect(element.nativeElement.classList.contains('hovered')).toBe(false);

    // Hover again
    element.nativeElement.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();
    expect(element.nativeElement.classList.contains('hovered')).toBe(true);
  });
});
