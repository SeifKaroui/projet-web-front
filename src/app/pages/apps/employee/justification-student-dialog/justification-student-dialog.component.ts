import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { StudentAbsenceFlat } from '../student/student.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { TablerIconsModule } from 'angular-tabler-icons';


@Component({
  selector: 'app-justification-student-dialog',
  templateUrl: './justification-student-dialog.component.html',
  styleUrls: ['./justification-student-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    TablerIconsModule,
    MatCardModule,
    ReactiveFormsModule,
  ],
})
export class JustificationStudentDialogComponent {
  justificationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<JustificationStudentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { absence: StudentAbsenceFlat }
  ) {
    this.justificationForm = this.fb.group({
      justification: ['', Validators.required]
    });
  }

  onConfirm(): void {
    if (this.justificationForm.valid) {
      const justification = this.justificationForm.value.justification;
      this.dialogRef.close({ action: 'confirm', justification });
    }
  }
}