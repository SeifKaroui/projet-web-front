import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JustificationStudentDialogComponent } from './justification-student-dialog.component';

describe('JustificationStudentDialogComponent', () => {
  let component: JustificationStudentDialogComponent;
  let fixture: ComponentFixture<JustificationStudentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JustificationStudentDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JustificationStudentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
