import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeworkService } from '../../services/homework.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { CustomDatePipe } from '../../pipes/custom-date.pipe';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/pages/authentication/services/auth.service';
import { Homework } from '../../models/homework.model';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-homework',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    CommonModule,
    CustomDatePipe,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './homework.component.html',
  styleUrls: ['./homework.component.scss'],
})
export class HomeworkComponent implements OnInit {

  loading = true;
  courseId: number | null = null;
  isTeacher: boolean = false;
  homeworks: any[] = [];
  isHomeworkFormOpen = false;
  newHomework = {
    title: '',
    description: '',
    day: null as number | null,
    month: null as number | null,
    year: null as number | null,
    time: '',
    courseId: 0,
  };
  isHomeworkSubmitting = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private homeworkService: HomeworkService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.isTeacher = this.authService.isTeacher();
    this.route.parent?.params.subscribe((params) => {
      this.courseId = +params['id'];
      this.loadHomeworks(this.courseId);
    });
  }

  loadHomeworks(courseId: number): void {
    this.homeworkService.getHomeworkByCourse(courseId).subscribe({
      next: (homeworks: any[]) => {
        this.loading = false;
        this.homeworks = homeworks;
      },
      error: (error: any) => {
        this.showError(("Error getting homework list."))
      }
    });
  }

  toggleHomeworkForm(): void {
    this.isHomeworkFormOpen = !this.isHomeworkFormOpen;
  }

  onHomeworkSubmit(): void {
    if (this.isHomeworkSubmitting) return;
    this.isHomeworkSubmitting = true;
  }

  cancelHomeworkForm(): void {
    this.isHomeworkFormOpen = false;
    this.isHomeworkSubmitting = false;
    this.newHomework = { title: '', description: '', day: null, month: null, year: null, time: '', courseId: 0 };
  }

  gotToAddHomework() {
    this.router.navigate(['/apps/courses/coursesdetail/', this.courseId, 'homework', 'add'])
  }

  viewDetails(homework: Homework) {
    this.router.navigate(['/apps/courses/coursesdetail/', this.courseId, 'homework', homework.id, 'details'])
  }

  deleteHomework(homework: Homework) {
    this.homeworkService.deleteHomework(homework.id).subscribe({
      next: (result) => {
        this.showSuccess("Homework deleted successfully.")
        this.loading = true;
        this.loadHomeworks(this.courseId!);
      },
      error: (error: any) => {
        this.showError(("Error deleting homework."))
      }
    });
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