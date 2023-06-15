import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewDataCmComponent } from './review-data-cm.component';

describe('ReviewDataCmComponent', () => {
  let component: ReviewDataCmComponent;
  let fixture: ComponentFixture<ReviewDataCmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewDataCmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewDataCmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
