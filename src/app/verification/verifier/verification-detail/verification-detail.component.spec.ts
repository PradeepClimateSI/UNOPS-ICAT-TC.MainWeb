import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationDetailComponent } from './verification-detail.component';

describe('VerificationDetailComponent', () => {
  let component: VerificationDetailComponent;
  let fixture: ComponentFixture<VerificationDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerificationDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerificationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
