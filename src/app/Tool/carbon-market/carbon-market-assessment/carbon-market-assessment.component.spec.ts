import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarbonMarketAssessmentComponent } from './carbon-market-assessment.component';

describe('CarbonMarketAssessmentComponent', () => {
  let component: CarbonMarketAssessmentComponent;
  let fixture: ComponentFixture<CarbonMarketAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarbonMarketAssessmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarbonMarketAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
