import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MaterialModule } from 'src/app/material.module';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatOptionModule } from '@angular/material/core';

import { HomeworkService } from '../../../services/homework.service';

@Component({
  selector: 'app-homework-student-submission',
  standalone: true,
  imports: [
    MaterialModule,
    MatCardModule,
    TablerIconsModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    MatProgressSpinnerModule,
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatSnackBarModule,
    MatOptionModule
  ],
  templateUrl: './homework-student-submission.component.html',
  styleUrl: './homework-student-submission.component.scss'
})
export class HomeworkStudentSubmissionComponent {
  courseId: number;
  homeworkId: number;
  selectedFiles: File[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.courseId = +this.route.parent?.snapshot.paramMap.get('id')!;
    this.homeworkId = +this.route.snapshot.paramMap.get('homeworkId')!;
  }


  onFileSelected(event: any): void {
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);
      if (file) {
        this.selectedFiles.push(file);
      }
    }
  }

  removeFile(fileToRemove: File): void {
    this.selectedFiles = this.selectedFiles.filter(file => file !== fileToRemove);
  }

  onSubmit(): void {


    // this.homeworkService.createHomework(formData, this.selectedFiles).subscribe({
    //   next: (homework) => {
    //     this.showSuccess('Homework created successfully');
    //     this.router.navigate(['apps/courses/coursesdetail/', this.courseId, 'homework', homework.id, 'details']);
    //   },
    //   error: (err) => {
    //     this.showError('Failed to create homework');
    //   }
    // });

  }

  onCancel(): void {
    this.router.navigate(['apps/courses/coursesdetail/', this.courseId, 'homework', this.homeworkId, 'details']);
  }

  showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 2000,
      panelClass: ['success-snackbar']
    });
  }

  showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 2000,
      panelClass: ['error-snackbar']
    });
  }
}