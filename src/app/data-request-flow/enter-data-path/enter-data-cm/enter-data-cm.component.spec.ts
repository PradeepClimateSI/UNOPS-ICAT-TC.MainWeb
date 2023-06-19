import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterDataCmComponent } from './enter-data-cm.component';

describe('EnterDataCmComponent', () => {
  let component: EnterDataCmComponent;
  let fixture: ComponentFixture<EnterDataCmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnterDataCmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterDataCmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
