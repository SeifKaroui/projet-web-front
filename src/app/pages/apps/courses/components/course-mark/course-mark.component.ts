// course-mark.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { GradingService } from '../../services/grading.service';
import { Student } from '../../models/Student.model';
import { Homework } from '../../models/homework.model';
import { HomeworkSubmission } from '../../models/homeworkSubmission.model';

import { FeedbackDialogComponent } from '../feedback-dialog/feedback-dialog.component';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
@Component({
  selector: 'app-course-mark',
  templateUrl: './course-mark.component.html',
  styleUrls: ['./course-mark.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
    MatMenuTrigger,
    FeedbackDialogComponent,
  ]
})
export class CourseMarkComponent implements OnInit {
  students: Student[] = [];
  homeworks: Homework[] = [];
  submissions: Record<number, Record<number, HomeworkSubmission>> = {};
  displayedColumns: string[] = [];

  courseId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private gradingService: GradingService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.courseId = +params['id'];
      this.loadData(this.courseId);
    });
  }

  loadData(courseId: number): void {
    forkJoin({
      students: this.gradingService.getStudentsByCourse(courseId),
      homeworks: this.gradingService.getHomeworksByCourse(courseId)
    }).subscribe(
      ({ students, homeworks }) => {
        this.students = students;
        this.homeworks = homeworks;
        this.displayedColumns = ['name', ...homeworks.map(hw => hw.id.toString())];

        // For each homework, fetch its submissions
        const submissionObservables = homeworks.map(hw =>
          this.gradingService.getSubmissionsByHomework(hw.id)
        );

        forkJoin(submissionObservables).subscribe(
          submissionsArray => {
            // Process submissions
            submissionsArray.forEach((submissions, index) => {
              const homeworkId = homeworks[index].id;
              submissions.forEach(sub => {
                if (!this.submissions[sub.studentId]) {
                  this.submissions[sub.studentId] = {};
                }
                this.submissions[sub.studentId][homeworkId] = sub;
              });
            });
          },
          error => {
            this.snackBar.open('Failed to load submissions', 'OK', { duration: 2000 });
          }
        );
      },
      error => {
        this.snackBar.open('Failed to load data', 'OK', { duration: 2000 });
      }
    );
  }

  hasSubmission(studentId: number, homeworkId: number): boolean {
    return !!this.submissions[studentId]?.[homeworkId];
  }

  getSubmission(studentId: number, homeworkId: number): HomeworkSubmission | null {
    return this.submissions[studentId]?.[homeworkId] || null;
  }

  getGrade(studentId: number, homeworkId: number): string {
    const submission = this.getSubmission(studentId, homeworkId);
    return submission && submission.grade !== undefined ? submission.grade.toString() : 'N/A';
  }

  onDownloadClick(fileUrl: string | undefined | null): void 
  { if (fileUrl) 
    { window.open(fileUrl, '_blank'); } 
    else 
    { this.snackBar.open('No file available for download', 'OK', { duration: 2000 }); } }

  openFeedbackDialog(submission: HomeworkSubmission): void {
    const dialogRef = this.dialog.open(FeedbackDialogComponent, {
      width: '400px',
      data: { grade: submission.grade || 0, feedback: submission.feedback || '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.gradingService.updateGrade(submission.id, result).subscribe(
          updatedSubmission => {
            // Update the submission locally
            this.submissions[submission.studentId][submission.homeworkId] = updatedSubmission;
            this.snackBar.open('Grade updated', 'OK', { duration: 2000 });
          },
          error => {
            this.snackBar.open('Failed to update grade', 'OK', { duration: 2000 });
          }
        );
      }
    });
  }
}
