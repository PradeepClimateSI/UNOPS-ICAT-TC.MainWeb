import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmSectionComponent } from './cm-section.component';

describe('CmSectionComponent', () => {
  let component: CmSectionComponent;
  let fixture: ComponentFixture<CmSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
