import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmSectionThreeComponent } from './cm-section-three.component';

describe('CmSectionThreeComponent', () => {
  let component: CmSectionThreeComponent;
  let fixture: ComponentFixture<CmSectionThreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmSectionThreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmSectionThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
