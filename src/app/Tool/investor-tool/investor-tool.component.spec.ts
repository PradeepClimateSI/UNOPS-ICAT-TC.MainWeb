import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestorToolComponent } from './investor-tool.component';

describe('InvestorToolComponent', () => {
  let component: InvestorToolComponent;
  let fixture: ComponentFixture<InvestorToolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvestorToolComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestorToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
