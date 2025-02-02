import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';

import { GradingService } from '../../services/grading.service';
import { Student } from '../../models/Student.model';
import { Homework } from '../../models/homework.model';
import { HomeworkSubmission } from '../../models/homeworkSubmission.model';
import { FeedbackDialogComponent } from '../feedback-dialog/feedback-dialog.component';

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

  ngOnInit(): void {
    // Similar to PostComponent, use parent params
    this.route.parent?.params.subscribe((params) => {
      this.courseId = +params['id'];
      if (this.courseId) {
        this.loadData();
      }
    });
  }

  private loadData(): void {
    forkJoin({
      students: this.gradingService.getStudentsByCourse(this.courseId),
      homeworks: this.gradingService.getHomeworksByCourse(this.courseId)
    }).pipe(
      switchMap(({ students, homeworks }) => {
        this.students = students;
        this.homeworks = homeworks;
        this.displayedColumns = ['name', ...homeworks.map(hw => hw.id.toString())];
        this.dataSource.data = this.students;

        return forkJoin(
          homeworks.map(hw => this.gradingService.getSubmissionsByHomework(hw.id))
        );
      })
    ).subscribe({
      next: (submissionsArray) => {
        submissionsArray.forEach((studentSubmissions, index) => {
          const homeworkId = this.homeworks[index].id;
          studentSubmissions.forEach(studentSubmission => {
            const studentId = studentSubmission.student.id;
            if (!this.submissions[studentId]) {
              this.submissions[studentId] = {};
            }
            if (studentSubmission.submission !== 'Not submitted') {
              const submissionData = studentSubmission.submission;
              this.submissions[studentId][homeworkId] = {
                id: submissionData.submissionID,
                grade: submissionData.grade !== 'Not graded' ? submissionData.grade : undefined,
                feedback: submissionData.feedback !== 'Not graded' ? submissionData.feedback : undefined,
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
      error: (error) => {
        console.error('Erreur lors du chargement des données :', error);
        this.snackBar.open('Échec du chargement des données', 'OK', { duration: 2000 });
        this.isLoading = false;
      }
    });
  }

  setMenuContext(studentId: string, homeworkId: number): void {
    this.menuStudentId = studentId;
    this.menuHomeworkId = homeworkId;
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
      return 'Non noté';
    }
    return 'Non soumis';
  }

  getFileUrlFromUploads(uploadsIds: number[]): string | undefined {
    if (uploadsIds && uploadsIds.length > 0) {
      return this.gradingService.getFileUrl(uploadsIds[0]);
    }
    return undefined;
  }

  onDownloadClick(fileUrl: string | undefined): void {
    if (fileUrl) {
      this.gradingService.downloadFile(fileUrl).subscribe(blob => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'fichier';
        link.click();
        URL.revokeObjectURL(url);
      });
    } else {
      this.snackBar.open('Aucun fichier disponible pour le téléchargement', 'OK', { duration: 2000 });
    }
  }

  openFeedbackDialog(submission: HomeworkSubmission | null): void {
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
            this.snackBar.open('Le retour ne peut pas être vide.', 'OK', { duration: 2000 });
            return;
          }

          this.gradingService.updateGrade(submission.id, result).subscribe({
            next: (updatedSubmission) => {
              submission.grade = updatedSubmission.grade;
              submission.feedback = updatedSubmission.feedback;
              this.snackBar.open('Note mise à jour', 'OK', { duration: 2000 });
            },
            error: () => {
              this.snackBar.open('Échec de la mise à jour de la note', 'OK', { duration: 2000 });
            }
          });
        }
      });
    } else {
      this.snackBar.open('Aucune soumission disponible pour fournir un retour.', 'OK', { duration: 2000 });
    }
  }
}
