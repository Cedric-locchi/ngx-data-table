import { Directive, ElementRef, HostListener, inject, input, InputSignal } from '@angular/core';

@Directive({
  selector: '[ngRowHover]',
  standalone: true,
})
export class RowHoverDirective {
  public readonly isClickable: InputSignal<boolean> = input(false);
  private readonly elementRef = inject(ElementRef);

  @HostListener('mouseenter')
  public onMouseEnter(): void {
    this.updateRowHover(true);
  }

  @HostListener('mouseleave')
  public onMouseLeave(): void {
    this.updateRowHover(false);
  }

  private updateRowHover(hovered: boolean): void {
    const element = this.elementRef.nativeElement as HTMLElement;
    const classList = Array.from(element.classList);

    const rowClass = classList.find((cls) => cls.startsWith('col-') && cls.includes('-'));

    if (rowClass) {
      const rowElements = document.querySelectorAll(`.${rowClass}`);
      rowElements.forEach((el) => {
        if (hovered) {
          el.classList.add('hovered');
          if (this.isClickable()) {
            el.classList.add('clickable');
          }
        } else {
          el.classList.remove('hovered', 'clickable');
        }
      });
    }
  }
}
