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
import { HomeworkService } from '../../../services/homework.service';
import { AuthService } from 'src/app/pages/authentication/services/auth.service';
import { HomeworkSubmission } from '../../../models/homework-submission';


@Component({
  selector: 'app-homework-student-submission-details',
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
  ],
  templateUrl: './homework-student-submission-details.component.html',
  styleUrl: './homework-student-submission-details.component.scss'
})
export class HomeworkStudentSubmissionDetailsComponent {

  homeworkId!: number;
  courseId!: number;
  loading = true;
  studentSubmission: HomeworkSubmission | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private homeworkService: HomeworkService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.homeworkId = +this.route.snapshot.paramMap.get('homeworkId')!;
    this.courseId = +this.route.parent?.snapshot.paramMap.get('id')!;
    this.loadStudentSubmissions();

  }


  loadStudentSubmissions() {
    this.homeworkService.fetchStudentSubmissions(this.homeworkId!).subscribe({
      next: (studentSubmission) => {
        this.studentSubmission = studentSubmission.length > 0 ? studentSubmission[0] : null;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
      }
    })
  }

  goToSubmission() {
    this.router.navigate(['apps/courses/coursesdetail/', this.courseId, 'homework', this.homeworkId, 'student-submission']);
  }
}
