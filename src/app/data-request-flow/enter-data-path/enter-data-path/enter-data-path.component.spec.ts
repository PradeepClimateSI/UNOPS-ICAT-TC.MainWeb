import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterDataPathComponent } from './enter-data-path.component';

describe('EnterDataPathComponent', () => {
  let component: EnterDataPathComponent;
  let fixture: ComponentFixture<EnterDataPathComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnterDataPathComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterDataPathComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
