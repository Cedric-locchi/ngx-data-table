import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTableInputSearchComponent } from './data-table-input-search.component';

describe('DataTableInputSearchComponent', () => {
  let component: DataTableInputSearchComponent;
  let fixture: ComponentFixture<DataTableInputSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataTableInputSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataTableInputSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
