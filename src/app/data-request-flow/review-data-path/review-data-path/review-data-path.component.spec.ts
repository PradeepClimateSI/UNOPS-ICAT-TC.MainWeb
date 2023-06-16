import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewDataPathComponent } from './review-data-path.component';

describe('ReviewDataPathComponent', () => {
  let component: ReviewDataPathComponent;
  let fixture: ComponentFixture<ReviewDataPathComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewDataPathComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewDataPathComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
