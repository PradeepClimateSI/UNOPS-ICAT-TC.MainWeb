import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentInprogressComponent } from './assessment-inprogress.component';

describe('AssessmentInprogressComponent', () => {
  let component: AssessmentInprogressComponent;
  let fixture: ComponentFixture<AssessmentInprogressComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssessmentInprogressComponent]
    });
    fixture = TestBed.createComponent(AssessmentInprogressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
