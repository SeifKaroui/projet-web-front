import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AbsenceService } from '../absence.service';
import { AuthService } from '../../../authentication/service/auth.service';
import { Router } from '@angular/router';
import { JustificationDialogComponent } from '../justification-dialog/justification-dialog.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatCardModule } from '@angular/material/card';

export interface StudentAbsenceFlat {
  id: number;
  date: string;
  justified: boolean;
  justification: string | null;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    type: string;
  };
  course: {
    id: number;
    title: string;
    description: string;
    type: string;
    startDate: string;
  };
}

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    TablerIconsModule,
    MatCardModule,
  ],
})
export class StudentComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataSource: MatTableDataSource<StudentAbsenceFlat>;
  displayedColumns: string[] = ['#', 'date', 'justified', 'justify'];

  constructor(
    private dialog: MatDialog,
    private absenceService: AbsenceService,
    private authService: AuthService,
    private router: Router
  ) {
    this.dataSource = new MatTableDataSource<StudentAbsenceFlat>();
  }

  ngOnInit(): void {
    console.log('welcome');
    if (this.authService.isAuthenticated() && this.authService.isStudent()) {
      this.loadAbsences();
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadAbsences(): void {
    console.log('loadAbsences called');
    const courseId = '3';
  
    this.absenceService.getStudentAbsences(courseId).subscribe({
      next: (absences: StudentAbsenceFlat[]) => {
        console.log('Fetched absences:', absences); // Log the fetched data
        this.dataSource.data = absences;
      },
      error: (error) => {
        console.error('Error fetching absences:', error); // Log any errors
      },
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openJustificationDialog(absence: StudentAbsenceFlat): void {
    const dialogRef = this.dialog.open(JustificationDialogComponent, {
      width: '400px',
      data: { absence },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'confirm') {
        const justification = result.justification;
        this.absenceService.justifyAbsence(absence.id, justification).subscribe({
          next: () => {
            this.loadAbsences(); // Refresh the data
          },
          error: (error) => {
            console.error('Error justifying absence:', error);
          },
        });
      }
    });
  }
}