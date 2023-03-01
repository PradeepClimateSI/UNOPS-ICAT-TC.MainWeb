import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstitutionViewComponent } from './institution-view.component';

describe('InstitutionViewComponent', () => {
  let component: InstitutionViewComponent;
  let fixture: ComponentFixture<InstitutionViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstitutionViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstitutionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
