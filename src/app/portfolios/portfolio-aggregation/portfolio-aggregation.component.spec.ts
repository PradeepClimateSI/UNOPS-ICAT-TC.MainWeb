import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioAggregationComponent } from './portfolio-aggregation.component';

describe('PortfolioAggregationComponent', () => {
  let component: PortfolioAggregationComponent;
  let fixture: ComponentFixture<PortfolioAggregationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortfolioAggregationComponent]
    });
    fixture = TestBed.createComponent(PortfolioAggregationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
