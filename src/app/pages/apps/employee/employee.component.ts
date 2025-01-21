import {
  Component,
  Input,
  OnInit,
  AfterViewInit,
  ViewChild,
  inject,
  OnChanges,
  SimpleChanges,
  Optional,
  Inject,
} from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSort } from '@angular/material/sort';
import { AbsenceService } from './absence.service';
import { AuthService } from '../../authentication/service/auth.service';
import { Router } from '@angular/router';
import { APP_ROUTES } from '../../authentication/app-routes.config';
import { JustificationDialogComponent } from './justification-dialog/justification-dialog.component';
import { StudentAbsence } from './add/student-absence.dto';

export interface Employee {
  id: number;
  Name: string;
  Position: string;
  Email: string;
  Mobile: number;
  DateOfJoining: Date;
  Salary: number;
  Projects: number;
  imagePath: string;
}

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  standalone: true,
  imports: [
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule,
    MatNativeDateModule,
    DatePipe,
    MatTable,
    MatPaginator,
    MatSort,
  ],
  providers: [DatePipe],
})
export class AppEmployeeComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Input() courseId?: number; // courseId est optionnel
  dataSource = new MatTableDataSource<StudentAbsence>([]);
  displayedColumns: string[] = ['#', 'name', 'email', 'justified', 'nonJustified', 'total', 'addAbsence', 'justification'];

  authService = inject(AuthService);
  router = inject(Router);
  absenceService = inject(AbsenceService);

  constructor(private dialog: MatDialog) {
    if (!this.authService.isTeacher()) {
      this.router.navigate([APP_ROUTES.unauthorized]);
    }
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated() && this.authService.isTeacher()) {
      this.loadAbsences();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['courseId'] && this.courseId) {
      this.loadAbsences(); // Rechargez les absences lorsque courseId change
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadAbsences(): void {
    if (!this.courseId) {
      console.error('Course ID is not defined.');
      return;
    }

    const courseId = this.courseId.toString(); // Utilisez le courseId dynamique
    console.log(courseId);
    this.absenceService.getAbsenceList(courseId).subscribe({
      next: (absenceList: StudentAbsence[]) => {
        this.absenceService.getAbsenceCounts(courseId).subscribe({
          next: (absenceCounts: any[]) => {
            const combinedData = absenceList.map((student) => {
              const counts = absenceCounts.find(
                (count) => count.email === student.student.email
              );

              const absencesWithJustification = student.absences.map((absence) => {
                const countAbsence = counts?.absences.find(
                  (countAbsence: any) => countAbsence.date === absence.date
                );

                return {
                  ...absence,
                  id: countAbsence?.id || absence.id,
                  justification: countAbsence?.justification,
                };
              });

              return {
                ...student,
                absences: absencesWithJustification,
                absenceCounts: counts
                  ? counts.absenceCounts
                  : { justifiedCount: 0, nonJustifiedCount: 0, totalCount: 0 },
              };
            });

            this.dataSource.data = combinedData;
            console.log('Combined data:', combinedData); // Log the combined data
          },
          error: (error) => {
            console.error('Error fetching absence counts:', error);
          },
        });
      },
      error: (error) => {
        console.error('Error fetching absence list:', error);
      },
    });
  }

  addAbsence(element: any): void {
    if (!this.courseId) {
      console.error('Course ID is not defined.');
      return;
    }

    const absenceData = {
      studentId: element.student.id,
      courseId: this.courseId, // Utilisez le courseId dynamique
      date: new Date().toISOString(),
      justified: false,
      justification: '',
    };

    this.absenceService.addAbsence(absenceData).subscribe({
      next: (response) => {
        console.log('Absence added successfully:', response);
        this.loadAbsences(); // Rechargez les absences après l'ajout
      },
      error: (error) => {
        console.error('Error adding absence:', error);
      },
    });
  }

  openJustificationDialog(element: StudentAbsence): void {
    console.log('Absences data:', element.absences); // Log the absences data
    const dialogRef = this.dialog.open(JustificationDialogComponent, {
      width: '400px',
      data: { justifications: element.absences },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'confirm') {
        const confirmedAbsence = result.absence;

        const student = this.dataSource.data.find(
          (student) => student.student.email === element.student.email
        );

        if (student) {
          student.absenceCounts.justifiedCount += 1;
          student.absenceCounts.nonJustifiedCount -= 1;

          const absence = student.absences.find(
            (absence) => absence.date === confirmedAbsence.date
          );
          if (absence) {
            absence.justified = true;
          }

          this.dataSource.data = [...this.dataSource.data];
        }
      } else if (result?.action === 'reject') {
        const rejectedAbsence = result.absence;

        const student = this.dataSource.data.find(
          (student) => student.student.email === element.student.email
        );

        if (student) {
          const absence = student.absences.find(
            (absence) => absence.date === rejectedAbsence.date
          );
          if (absence) {
            absence.justification = null;
          }

          this.dataSource.data = [...this.dataSource.data];
        }
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

@Component({
  selector: 'app-dialog-content',
  standalone: true,
  imports: [MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: 'employee-dialog-content.html',
  providers: [DatePipe],
})
export class AppEmployeeDialogContentComponent {
  action: string;
  local_data: any;
  selectedImage: any = '';

  constructor(
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<AppEmployeeDialogContentComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Employee
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;

    if (this.local_data.imagePath === undefined) {
      this.local_data.imagePath = 'assets/images/profile/user-1.jpg';
    }
  }

  doAction(): void {
    this.dialogRef.close({ event: this.action, data: this.local_data });
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

  selectFile(event: any): void {
    if (!event.target.files[0] || event.target.files[0].length === 0) {
      return;
    }
    const mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      this.local_data.imagePath = reader.result;
    };
  }
}