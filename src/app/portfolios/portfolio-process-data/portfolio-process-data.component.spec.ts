import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioProcessDataComponent } from './portfolio-process-data.component';

describe('PortfolioProcessDataComponent', () => {
  let component: PortfolioProcessDataComponent;
  let fixture: ComponentFixture<PortfolioProcessDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortfolioProcessDataComponent]
    });
    fixture = TestBed.createComponent(PortfolioProcessDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
