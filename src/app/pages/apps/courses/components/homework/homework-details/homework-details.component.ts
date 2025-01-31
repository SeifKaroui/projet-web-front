import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeworkService } from '../../../services/homework.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/pages/authentication/service/auth.service';
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
import { HomeworkSubmission } from '../../../models/homework-submission';
import { HomeworkStudentSubmissionDetailsComponent } from "../homework-student-submission-details/homework-student-submission-details.component";

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
    private router: Router,
    private homeworkService: HomeworkService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.homeworkId = +this.route.snapshot.paramMap.get('homeworkId')!;
    this.courseId = +this.route.parent?.snapshot.paramMap.get('id')!;
    this.isTeacher = this.authService.isTeacher();
    this.loadHomework();
    if (!this.isTeacher) {
      this.loadStudentSubmissions();
    }
  }

  loadHomework() {
    this.homeworkService.getHomeworkById(this.homeworkId!).subscribe({
      next: (homework) => {
        this.homework = homework;
        this.loadingHomework = false;
        // console.log(homework)
      },
      error: (err) => { }
    })

  }

  loadStudentSubmissions() {
    this.homeworkService.fetchStudentSubmissions(this.homeworkId!).subscribe({
      next: (studentSubmission) => {
        this.studentSubmission = studentSubmission.length > 0 ? studentSubmission[0] : null;
        this.loadingStudentSubmissions = false;
      },
      error: (err) => { }
    })
  }
  
  openFile(fileId: number) {
    window.open("http://localhost:3000/files/" + fileId, '_blank');
  }
  // viewStudentSubmissions() {
  //   this.router.navigate(['/apps/courses/coursesdetail/', this.courseId, 'homework', this.homeworkId, 'students-submissions'])
  // }
  // viewStudentSubmissions() {
  //   this.router.navigate(['/apps/courses/coursesdetail/', this.courseId, 'homework', this.homeworkId, 'students-submissions'])
  // }
}
