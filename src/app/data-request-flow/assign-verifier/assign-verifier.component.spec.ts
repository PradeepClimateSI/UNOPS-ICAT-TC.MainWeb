import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignVerifierComponent } from './assign-verifier.component';

describe('AssignVerifierComponent', () => {
  let component: AssignVerifierComponent;
  let fixture: ComponentFixture<AssignVerifierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignVerifierComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignVerifierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
