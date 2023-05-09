import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioTrack4Component } from './portfolio-track4.component';

describe('PortfolioTrack4Component', () => {
  let component: PortfolioTrack4Component;
  let fixture: ComponentFixture<PortfolioTrack4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PortfolioTrack4Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PortfolioTrack4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
