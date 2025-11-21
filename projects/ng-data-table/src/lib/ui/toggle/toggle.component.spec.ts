import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToggleComponent } from './toggle.component';
import { describe, expect, it, beforeEach } from 'vitest';

describe('ToggleComponent', () => {
  let component: ToggleComponent;
  let fixture: ComponentFixture<ToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToggleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit checkedChange when clicked', () => {
    let checked = false;
    component.checkedChange.subscribe((val) => (checked = val));

    const input = fixture.nativeElement.querySelector('input');
    input.click();

    expect(checked).toBe(true);
  });

  it('should reflect input checked state', () => {
    fixture.componentRef.setInput('checked', true);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input');
    expect(input.checked).toBe(true);
  });
});
