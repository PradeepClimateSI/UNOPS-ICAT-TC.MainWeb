import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaiseConcernSectionComponent } from './raise-concern-section.component';

describe('RaiseConcernSectionComponent', () => {
  let component: RaiseConcernSectionComponent;
  let fixture: ComponentFixture<RaiseConcernSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RaiseConcernSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RaiseConcernSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
