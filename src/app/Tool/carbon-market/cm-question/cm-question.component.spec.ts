import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmQuestionComponent } from './cm-question.component';

describe('CmQuestionComponent', () => {
  let component: CmQuestionComponent;
  let fixture: ComponentFixture<CmQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmQuestionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
