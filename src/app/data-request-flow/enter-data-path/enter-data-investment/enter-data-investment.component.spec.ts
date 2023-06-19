import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterDataInvestmentComponent } from './enter-data-investment.component';

describe('EnterDataInvestorComponent', () => {
  let component: EnterDataInvestmentComponent;
  let fixture: ComponentFixture<EnterDataInvestmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnterDataInvestmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterDataInvestmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
