import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatOptionModule } from '@angular/material/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { HomeworkService } from '../../../services/homework.service';

@Component({
  selector: 'app-homework-add',
  standalone: true,
  imports: [
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
  templateUrl: './homework-add.component.html',
  styleUrl: './homework-add.component.scss'
})
export class HomeworkAddComponent implements OnInit {
  homeworkForm: FormGroup;
  courseId: number;
  selectedFiles: File[] = [];

  constructor(
    private fb: FormBuilder,
    private homeworkService: HomeworkService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.courseId = +this.route.parent?.snapshot.paramMap.get('id')!;
    this.initForm();
  }

  initForm(): void {
    this.homeworkForm = this.fb.group({
      title: ['', [Validators.required,]],
      description: ['', [Validators.required,]],
      deadline: ['', Validators.required]
    });
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
    if (this.homeworkForm.valid) {
      const formData = {
        ...this.homeworkForm.value,
        deadline: new Date(this.homeworkForm.value["deadline"]).toISOString(),
        courseId: this.courseId
      };

      this.homeworkService.createHomework(formData, this.selectedFiles).subscribe({
        next: (homework) => {
          this.showSuccess('Homework created successfully');
          this.router.navigate(['apps/courses/coursesdetail/', this.courseId, 'homework', homework.id, 'details']);
        },
        error: (err) => {
          this.showError('Failed to create homework');
        }
      });
    } else {
      this.showError('Please fill in all required fields');
    }
  }

  onCancel(): void {
    this.router.navigate(['apps/courses/coursesdetail/', this.courseId, 'homework']);
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