import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentResultInvestorComponent } from './assessment-result-investor.component';

describe('AssessmentResultInvestorComponent', () => {
  let component: AssessmentResultInvestorComponent;
  let fixture: ComponentFixture<AssessmentResultInvestorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssessmentResultInvestorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentResultInvestorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
