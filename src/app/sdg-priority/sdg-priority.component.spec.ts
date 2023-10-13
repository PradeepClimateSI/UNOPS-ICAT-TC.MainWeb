import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SdgPriorityComponent } from './sdg-priority.component';

describe('SdgPriorityComponent', () => {
  let component: SdgPriorityComponent;
  let fixture: ComponentFixture<SdgPriorityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SdgPriorityComponent]
    });
    fixture = TestBed.createComponent(SdgPriorityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
