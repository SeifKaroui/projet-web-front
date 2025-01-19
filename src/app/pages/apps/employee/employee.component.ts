import {
  Component,
  Inject,
  Optional,
  ViewChild,
  AfterViewInit,
  OnInit,
  inject,
} from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { AppAddEmployeeComponent } from './add/add.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatNativeDateModule } from '@angular/material/core';
import { StudentAbsence } from './add/student-absence.dto';
import { MatSort } from '@angular/material/sort';
import { AbsenceService } from './absence.service';
import { AuthService } from '../../authentication/service/auth.service';
import { Router } from '@angular/router';
import { APP_ROUTES } from '../../authentication/app-routes.config';
import { JustificationDialogComponent } from './justification-dialog/justification-dialog.component';

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


const employees = [
  {
    id: 1,
    Name: 'Johnathan Deo',
    Position: 'Seo Expert',
    Email: 'r@gmail.com',
    Mobile: 9786838,
    DateOfJoining: new Date('01-2-2020'),
    Salary: 12000,
    Projects: 10,
    imagePath: 'assets/images/profile/user-2.jpg',
  },
  {
    id: 2,
    Name: 'Mark Zukerburg',
    Position: 'Web Developer',
    Email: 'mark@gmail.com',
    Mobile: 8786838,
    DateOfJoining: new Date('04-2-2020'),
    Salary: 12000,
    Projects: 10,
    imagePath: 'assets/images/profile/user-3.jpg',
  },
  {
    id: 3,
    Name: 'Sam smith',
    Position: 'Web Designer',
    Email: 'sam@gmail.com',
    Mobile: 7788838,
    DateOfJoining: new Date('02-2-2020'),
    Salary: 12000,
    Projects: 10,
    imagePath: 'assets/images/profile/user-4.jpg',
  },
  {
    id: 4,
    Name: 'John Deo',
    Position: 'Tester',
    Email: 'john@gmail.com',
    Mobile: 8786838,
    DateOfJoining: new Date('03-2-2020'),
    Salary: 12000,
    Projects: 11,
    imagePath: 'assets/images/profile/user-5.jpg',
  },
  {
    id: 5,
    Name: 'Genilia',
    Position: 'Actor',
    Email: 'genilia@gmail.com',
    Mobile: 8786838,
    DateOfJoining: new Date('05-2-2020'),
    Salary: 12000,
    Projects: 19,
    imagePath: 'assets/images/profile/user-6.jpg',
  },
  {
    id: 6,
    Name: 'Jack Sparrow',
    Position: 'Content Writer',
    Email: 'jac@gmail.com',
    Mobile: 8786838,
    DateOfJoining: new Date('05-21-2020'),
    Salary: 12000,
    Projects: 5,
    imagePath: 'assets/images/profile/user-7.jpg',
  },
  {
    id: 7,
    Name: 'Tom Cruise',
    Position: 'Actor',
    Email: 'tom@gmail.com',
    Mobile: 8786838,
    DateOfJoining: new Date('02-15-2019'),
    Salary: 12000,
    Projects: 9,
    imagePath: 'assets/images/profile/user-3.jpg',
  },
  {
    id: 8,
    Name: 'Hary Porter',
    Position: 'Actor',
    Email: 'hary@gmail.com',
    Mobile: 8786838,
    DateOfJoining: new Date('07-3-2019'),
    Salary: 12000,
    Projects: 7,
    imagePath: 'assets/images/profile/user-6.jpg',
  },
  {
    id: 9,
    Name: 'Kristen Ronaldo',
    Position: 'Player',
    Email: 'kristen@gmail.com',
    Mobile: 8786838,
    DateOfJoining: new Date('01-15-2019'),
    Salary: 12000,
    Projects: 1,
    imagePath: 'assets/images/profile/user-5.jpg',
  },
];

@Component({
  templateUrl: './employee.component.html',
  standalone: true,
  imports: [
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule,
    MatNativeDateModule,
    DatePipe,
  ],
  providers: [DatePipe],
})
export class AppEmployeeComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataSource: MatTableDataSource<StudentAbsence>;
  displayedColumns: string[] = ['#', 'name', 'email', 'justified', 'nonJustified', 'total', 'addAbsence', 'justification'];

  authService = inject(AuthService);
  router = inject(Router);
  absenceService = inject(AbsenceService);

  constructor(private dialog: MatDialog) {
    this.dataSource = new MatTableDataSource<StudentAbsence>();
    if (!this.authService.isTeacher()) {
      this.router.navigate([APP_ROUTES.unauthorized]);
    }
  }

  openJustificationDialog(element: StudentAbsence): void {
    console.log('Absences data:', element.absences); // Log the absences data
    const dialogRef = this.dialog.open(JustificationDialogComponent, {
      width: '400px',
      data: { justifications: element.absences },
    });
  
    // Handle the result when the modal is closed
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'confirm') {
        const confirmedAbsence = result.absence;
  
        // Update the absence counts in the table
        const student = this.dataSource.data.find(
          (student) => student.student.email === element.student.email
        );
  
        if (student) {
          // Update the justified and nonJustified counts
          student.absenceCounts.justifiedCount += 1;
          student.absenceCounts.nonJustifiedCount -= 1;
  
          // Update the absence in the list
          const absence = student.absences.find(
            (absence) => absence.date === confirmedAbsence.date
          );
          if (absence) {
            absence.justified = true;
          }
  
          // Refresh the table
          this.dataSource.data = [...this.dataSource.data];
        }
      } else if (result?.action === 'reject') {
        const rejectedAbsence = result.absence;
  
        // Update the absence list in the table
        const student = this.dataSource.data.find(
          (student) => student.student.email === element.student.email
        );
  
        if (student) {
          // Update the absence in the list
          const absence = student.absences.find(
            (absence) => absence.date === rejectedAbsence.date
          );
          if (absence) {
            absence.justification = null;
          }
  
          // Refresh the table
          this.dataSource.data = [...this.dataSource.data];
        }
      }
    });
  }

  addAbsence(element: any): void {
    console.log('Element data:', element);
    const absenceData = {
      studentId: element.student.id,
      courseId: 1,
      date: new Date().toISOString(),
      justified: false,
      justification: '',
    };

    this.absenceService.addAbsence(absenceData).subscribe({
      next: (response) => {
        console.log('Absence added successfully:', response);
        this.loadAbsences(); // Refresh the data
      },
      error: (error) => {
        console.error('Error adding absence:', error);
      },
    });
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated() && this.authService.isTeacher()) {
      this.loadAbsences();
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadAbsences(): void {
    const courseId = '1'; // Replace with the actual course ID
  
    // Fetch the absence list
    this.absenceService.getAbsenceList(courseId).subscribe({
      next: (absenceList: StudentAbsence[]) => {
        // Fetch the absence counts
        this.absenceService.getAbsenceCounts(courseId).subscribe({
          next: (absenceCounts: any[]) => {
            // Combine the data
            const combinedData = absenceList.map((student) => {
              const counts = absenceCounts.find(
                (count) => count.email === student.student.email
              );
  
              // Merge the absence details with the justification field
              const absencesWithJustification = student.absences.map((absence) => {
                // Find the corresponding absence in the absenceCounts response
                const countAbsence = counts?.absences.find(
                  (countAbsence: any) => countAbsence.date === absence.date
                );
  
                // Add the justification and id fields if they exist
                return {
                  ...absence,
                  id: countAbsence?.id || absence.id,
                  justification: countAbsence?.justification,
                };
              });
  
              return {
                ...student,
                absences: absencesWithJustification, // Update the absences with justification
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

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-dialog-content',
  standalone: true,
  imports: [MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: 'employee-dialog-content.html',
  providers: [DatePipe],
})
// tslint:disable-next-line: component-class-suffix
export class AppEmployeeDialogContentComponent {
  action: string;
  // tslint:disable-next-line - Disables all
  local_data: any;
  selectedImage: any = '';

  constructor(
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<AppEmployeeDialogContentComponent>,
    // @Optional() is used to prevent error if no data is passed
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
      // this.msg = 'You must select an image';
      return;
    }
    const mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      // this.msg = "Only images are supported";
      return;
    }
    // tslint:disable-next-line - Disables all
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    // tslint:disable-next-line - Disables all
    reader.onload = (_event) => {
      // tslint:disable-next-line - Disables all
      this.local_data.imagePath = reader.result;
    };
  }
}
