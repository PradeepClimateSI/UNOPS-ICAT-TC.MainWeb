import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewDataInvestmentComponent } from './review-data-investment.component';

describe('ReviewDataInvestmentComponent', () => {
  let component: ReviewDataInvestmentComponent;
  let fixture: ComponentFixture<ReviewDataInvestmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewDataInvestmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewDataInvestmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
