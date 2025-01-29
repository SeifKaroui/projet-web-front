import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { GradingService, StudentSubmission } from '../../services/grading.service';
import { Student } from '../../models/Student.model';
import { Homework } from '../../models/homework.model';
import { HomeworkSubmission } from '../../models/homeworkSubmission.model';

import { FeedbackDialogComponent } from '../feedback-dialog/feedback-dialog.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
@Component({
  selector: 'app-course-mark',
  templateUrl: './course-mark.component.html',
  styleUrls: ['./course-mark.component.scss'],
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    CommonModule,
    FormsModule,
    MatTableModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
  ]
})
export class CourseMarkComponent implements OnInit {
  menuStudentId: string = '';
   menuHomeworkId: number = 0;
  dataSource = new MatTableDataSource<Student>();
  students: Student[] = [];
  homeworks: Homework[] = [];
  submissions: Record<string, Record<number, HomeworkSubmission>> = {};
  displayedColumns: string[] = ['name'];
  isLoading: boolean = true;

  courseId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private gradingService: GradingService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}
  setMenuContext(studentId: string, homeworkId: number): void
   { this.menuStudentId = studentId; this.menuHomeworkId = homeworkId; }
  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(params => {
        this.courseId = +params['id'];
        return forkJoin({
          students: this.gradingService.getStudentsByCourse(this.courseId),
          homeworks: this.gradingService.getHomeworksByCourse(this.courseId)
        });
      }),
      switchMap(({ students, homeworks }) => {
        this.students = students;
        this.homeworks = homeworks;
        this.displayedColumns = ['name', ...homeworks.map(hw => hw.id.toString())];
        this.dataSource.data = this.students;

        const submissionObservables = homeworks.map(hw =>
          this.gradingService.getSubmissionsByHomework(hw.id)
        );
        return forkJoin(submissionObservables);
      })
    ).subscribe(
      submissionsArray => {
        submissionsArray.forEach((studentSubmissions, index) => {
          const homeworkId = this.homeworks[index].id;

          studentSubmissions.forEach(studentSubmission => {
            const studentId = studentSubmission.student.id;

            if (!this.submissions[studentId]) {
              this.submissions[studentId] = {};
            }

            if (studentSubmission.submission !== 'Not submitted') {
              const submissionData = studentSubmission.submission;
              const grade =
                submissionData.grade !== 'Not graded'
                  ? (submissionData.grade as number)
                  : undefined;
              const feedback =
                submissionData.feedback !== 'Not graded'
                  ? (submissionData.feedback as string)
                  : undefined;

              this.submissions[studentId][homeworkId] = {
                id: submissionData.submissionID,
                grade: grade,
                feedback: feedback,
                studentId: studentId,
                homeworkId: homeworkId,
                uploadIds: submissionData.uploadsIds,
                fileUrl: this.getFileUrlFromUploads(submissionData.uploadsIds)
              };
            }
          });
        });
        this.isLoading = false;
      },
      error => {
        this.snackBar.open('Failed to load data', 'OK', { duration: 2000 });
        this.isLoading = false;
      }
    );
  }

  hasSubmission(studentId: string, homeworkId: number): boolean {
    return !!this.submissions[studentId]?.[homeworkId];
  }

  getSubmission(studentId: string, homeworkId: number): HomeworkSubmission | null {
    return this.submissions[studentId]?.[homeworkId] || null;
  }

  getGrade(studentId: string, homeworkId: number): string {
    const submission = this.getSubmission(studentId, homeworkId);
    if (submission && submission.grade !== undefined) {
      return submission.grade.toString();
    } else if (submission && submission.grade === undefined) {
      return 'Not graded';
    } else {
      return 'Not submitted';
    }
  }

  getFileUrlFromUploads(uploadsIds: number[]): string | undefined {
    if (uploadsIds && uploadsIds.length > 0) {
      const uploadId = uploadsIds[0];
      return this.gradingService.getFileUrl(uploadId);
    }
    return undefined;
  }

  onDownloadClick(fileUrl: string | undefined): void {
    if (fileUrl) {
      this.gradingService.downloadFile(fileUrl).subscribe(blob => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'file'; // adjust filename
        link.click();
        URL.revokeObjectURL(url);
      });
    } else {
      this.snackBar.open('No file available for download', 'OK', { duration: 2000 });
    }
  }
  openFeedbackDialog(submission: HomeworkSubmission | null): void {
    console.log('openFeedbackDialog called with submission:');
    if (submission) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = '400px';
      dialogConfig.data = {
        grade: submission.grade ?? 0,
        feedback: submission.feedback ?? ''
      };

      const dialogRef = this.dialog.open(FeedbackDialogComponent, dialogConfig);

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          if (result.feedback.trim() === '') {
            this.snackBar.open('Feedback cannot be empty.', 'OK', { duration: 2000 });
            return;
          }

          this.gradingService.updateGrade(submission.id, result).subscribe(
            updatedSubmission => {
              submission.grade = updatedSubmission.grade;
              submission.feedback = updatedSubmission.feedback;
              this.snackBar.open('Grade updated', 'OK', { duration: 2000 });
            },
            error => {
              this.snackBar.open('Failed to update grade', 'OK', { duration: 2000 });
            }
          );
        }
      });
    } else {
      this.snackBar.open('No submission available to provide feedback.', 'OK', { duration: 2000 });
    }
  }
}