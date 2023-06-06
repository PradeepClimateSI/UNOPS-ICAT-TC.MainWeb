import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarbonMarketDashboardComponent } from './carbon-market-dashboard.component';

describe('CarbonMarketDashboardComponent', () => {
  let component: CarbonMarketDashboardComponent;
  let fixture: ComponentFixture<CarbonMarketDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarbonMarketDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarbonMarketDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
