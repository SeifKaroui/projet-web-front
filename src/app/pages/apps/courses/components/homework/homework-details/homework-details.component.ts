import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeworkService } from '../../../services/homework.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/pages/authentication/services/auth.service';
import { Homework } from '../../../models/homework.model';
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
import { HomeworkStudentSubmissionDetailsComponent } from "../homework-student-submission-details/homework-student-submission-details.component";
import { HomeworkSubmission } from '../../../models/homeworkSubmission.model';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-homework-details',
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
    MatSnackBarModule,
    MatProgressSpinnerModule,
    HomeworkStudentSubmissionDetailsComponent
  ],
  templateUrl: './homework-details.component.html',
  styleUrl: './homework-details.component.scss'
})
export class HomeworkDetailsComponent implements OnInit {

  homeworkId!: number;
  courseId!: number;
  isTeacher: boolean = false;
  isHomeworkFormOpen = false;
  homework: Homework | null = null;
  loadingHomework = true;
  loadingStudentSubmissions = true;
  studentSubmission: HomeworkSubmission | null = null;

  constructor(
    private route: ActivatedRoute,
    private homeworkService: HomeworkService,
    private authService: AuthService,
    private snackBar: MatSnackBar

  ) { }

  ngOnInit(): void {
    this.homeworkId = +this.route.snapshot.paramMap.get('homeworkId')!;
    this.courseId = +this.route.parent?.snapshot.paramMap.get('id')!;
    this.isTeacher = this.authService.isTeacher();
    this.loadHomework();
  }

  loadHomework() {
    this.homeworkService.getHomeworkById(this.homeworkId!).subscribe({
      next: (homework) => {
        this.homework = homework;
        this.loadingHomework = false;
      },
      error: (err) => {
        this.showError(("Error getting homework details."))

      }
    })

  }


  openFile(fileId: number) {
    window.open("http://localhost:3000/files/" + fileId, '_blank');
  }
  showSuccess(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 2000,
      panelClass: ['success-snackbar'],
    });
  }

  showError(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 2000,
      panelClass: ['error-snackbar'],
    });
  }
}
