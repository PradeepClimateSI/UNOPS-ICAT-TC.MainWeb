import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonconformanceReportComponent } from './nonconformance-report.component';

describe('NonconformanceReportComponent', () => {
  let component: NonconformanceReportComponent;
  let fixture: ComponentFixture<NonconformanceReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NonconformanceReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NonconformanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
