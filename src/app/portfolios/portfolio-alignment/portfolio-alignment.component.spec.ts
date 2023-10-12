import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioAlignmentComponent } from './portfolio-alignment.component';

describe('PortfolioAlignmentComponent', () => {
  let component: PortfolioAlignmentComponent;
  let fixture: ComponentFixture<PortfolioAlignmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortfolioAlignmentComponent]
    });
    fixture = TestBed.createComponent(PortfolioAlignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
