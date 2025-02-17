import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';

@Component({
  selector: 'intranet-base',
  standalone: true,
  imports: [CommonModule],
  template: '',
})
export abstract class BaseComponent implements OnDestroy {
  protected $unsubscribe: Subject<void> = new Subject<void>();

  ngOnDestroy(): void {
    this.$unsubscribe.next();
    this.$unsubscribe.complete();
  }
}
