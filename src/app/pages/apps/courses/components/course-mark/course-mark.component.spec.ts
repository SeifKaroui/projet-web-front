import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseMarkComponent } from './course-mark.component';

describe('CourseMarkComponent', () => {
  let component: CourseMarkComponent;
  let fixture: ComponentFixture<CourseMarkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseMarkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseMarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
