import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptedPoliciesComponent } from './accepted-policies.component';

describe('AcceptedPoliciesComponent', () => {
  let component: AcceptedPoliciesComponent;
  let fixture: ComponentFixture<AcceptedPoliciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcceptedPoliciesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptedPoliciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
