import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTableFooterComponent } from './data-table-footer.component';

describe('DataTableFooterComponent', () => {
  let component: DataTableFooterComponent;
  let fixture: ComponentFixture<DataTableFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataTableFooterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataTableFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
