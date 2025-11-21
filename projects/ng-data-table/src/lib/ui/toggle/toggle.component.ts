import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';

@Component({
  selector: 'ng-toggle',
  standalone: true,
  template: `
    <label class="toggle-switch">
      <input type="checkbox" [checked]="checked()" (change)="onChange($event)" />
      <span class="slider round"></span>
    </label>
  `,
  styles: [
    `
      .toggle-switch {
        position: relative;
        display: inline-block;
        width: 36px;
        height: 20px;
      }

      .toggle-switch input {
        opacity: 0;
        width: 0;
        height: 0;
      }

      .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #cbd5e1;
        transition: 0.4s;
        border-radius: 34px;
      }

      .slider:before {
        position: absolute;
        content: '';
        height: 16px;
        width: 16px;
        left: 2px;
        bottom: 2px;
        background-color: white;
        transition: 0.4s;
        border-radius: 50%;
      }

      input:checked + .slider {
        background-color: #0f172a;
      }

      input:focus + .slider {
        box-shadow: 0 0 1px #0f172a;
      }

      input:checked + .slider:before {
        transform: translateX(16px);
      }
    `,
  ],
})
export class ToggleComponent {
  public readonly checked: InputSignal<boolean> = input(false);
  public readonly checkedChange: OutputEmitterRef<boolean> = output<boolean>();

  public onChange(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.checkedChange.emit(isChecked);
  }
}
