import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllTooDashbordComponent } from './all-too-dashbord.component';

describe('AllTooDashbordComponent', () => {
  let component: AllTooDashbordComponent;
  let fixture: ComponentFixture<AllTooDashbordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllTooDashbordComponent]
    });
    fixture = TestBed.createComponent(AllTooDashbordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
