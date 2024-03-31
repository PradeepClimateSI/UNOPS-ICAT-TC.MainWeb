import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentFlowComponent } from './assessment-flow.component';

describe('AssessmentFlowComponent', () => {
  let component: AssessmentFlowComponent;
  let fixture: ComponentFixture<AssessmentFlowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssessmentFlowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssessmentFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
