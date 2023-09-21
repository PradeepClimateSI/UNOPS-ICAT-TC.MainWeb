import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioComparisonComponent } from './portfolio-comparison.component';

describe('PortfolioComparisonComponent', () => {
  let component: PortfolioComparisonComponent;
  let fixture: ComponentFixture<PortfolioComparisonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortfolioComparisonComponent]
    });
    fixture = TestBed.createComponent(PortfolioComparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
