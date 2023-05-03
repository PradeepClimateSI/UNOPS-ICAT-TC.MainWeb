import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmResultComponent } from './cm-result.component';

describe('CmResultComponent', () => {
  let component: CmResultComponent;
  let fixture: ComponentFixture<CmResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmResultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
