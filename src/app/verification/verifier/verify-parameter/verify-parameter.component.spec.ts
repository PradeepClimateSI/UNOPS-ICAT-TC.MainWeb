import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyParameterComponent } from './verify-parameter.component';

describe('VerifyParameterComponent', () => {
  let component: VerifyParameterComponent;
  let fixture: ComponentFixture<VerifyParameterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifyParameterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
