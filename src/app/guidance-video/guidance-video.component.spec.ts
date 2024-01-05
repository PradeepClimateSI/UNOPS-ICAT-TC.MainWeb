import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuidanceVideoComponent } from './guidance-video.component';

describe('GuidanceVideoComponent', () => {
  let component: GuidanceVideoComponent;
  let fixture: ComponentFixture<GuidanceVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuidanceVideoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuidanceVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
