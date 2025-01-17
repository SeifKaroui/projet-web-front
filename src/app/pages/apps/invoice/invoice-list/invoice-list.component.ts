import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TablerIconsModule } from 'angular-tabler-icons';
import { StudentSubmission } from './DTO/student-interface.dto';
import { StudentSubmissionService } from './service/student-submission.service';

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    TablerIconsModule
  ],
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss']
})
export class AppInvoiceListComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<StudentSubmission>;
  displayedColumns: string[] = [
    'firstName',
    'lastName', 
    'email',
    'jobTitle',
    'submissionDate',
    'grade',
    'comments',
    'actions'
  ];

  submissionStats = {
    submitted: 0,
    notSubmitted: 0
  };

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private submissionService: StudentSubmissionService) {
    this.dataSource = new MatTableDataSource<StudentSubmission>();
  }

  ngOnInit(): void {
    this.loadSubmissions();
    this.loadStats();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  loadSubmissions(): void {
    this.submissionService.getStudentSubmissions('default-homework-id')
      .subscribe(submissions => {
        this.dataSource.data = submissions;
      });
  }

  loadStats(): void {
    this.submissionService.getSubmissionStats('default-homework-id')
      .subscribe(stats => {
        this.submissionStats = stats;
      });
  }
  filter(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.dataSource.filter = input.value.trim().toLowerCase();
  }


  updateGradeValue(submission: StudentSubmission, grade: number): void {
    this.submissionService.updateGrade(
      submission.id,
      grade,
      submission.comments || ''
    ).subscribe(updated => {
      const index = this.dataSource.data.findIndex(s => s.id === updated.id);
      if (index !== -1) {
        this.dataSource.data[index] = updated;
        this.dataSource._updateChangeSubscription();
      }
    });
  }
  updateComments(submission: StudentSubmission, comments: string): void {
    this.submissionService.updateGrade(
      submission.id,
      submission.grade || 0,
      comments
    ).subscribe(updated => {
      const index = this.dataSource.data.findIndex(s => s.id === updated.id);
      if (index !== -1) {
        this.dataSource.data[index] = updated;
        this.dataSource._updateChangeSubscription();
      }
    });
  }
  downloadSubmission(submission: StudentSubmission): void {
    this.submissionService.downloadSubmission(submission.id)
      .subscribe(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${submission.firstName}_${submission.lastName}_submission`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      });
  }
}