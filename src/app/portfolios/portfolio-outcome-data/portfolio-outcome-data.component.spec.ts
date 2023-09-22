import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioOutcomeDataComponent } from './portfolio-outcome-data.component';

describe('PortfolioOutcomeDataComponent', () => {
  let component: PortfolioOutcomeDataComponent;
  let fixture: ComponentFixture<PortfolioOutcomeDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortfolioOutcomeDataComponent]
    });
    fixture = TestBed.createComponent(PortfolioOutcomeDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
