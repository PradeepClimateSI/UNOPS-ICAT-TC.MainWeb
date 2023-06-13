import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterDataPortfolioComponent } from './enter-data-portfolio.component';

describe('EnterDataPortfolioComponent', () => {
  let component: EnterDataPortfolioComponent;
  let fixture: ComponentFixture<EnterDataPortfolioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnterDataPortfolioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterDataPortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
