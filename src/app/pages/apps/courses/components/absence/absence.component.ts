import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { TablerIconsModule } from 'angular-tabler-icons';
import { AuthService } from '../../../../authentication/service/auth.service';
import { ColorService } from '../../services/color.service';
import { FormsModule } from '@angular/forms';
import { AbsenceService } from '../../services/absence.service';

export interface StudentAbsence {
  id: number;
  date: string;
  justified: boolean;
  confirmed: boolean;
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

export interface AbsenceCount {
  justifiedCount: number;
  nonJustifiedCount: number;
  validatedJustifications: number;
  rejectedJustifications: number;
  totalCount: number;
}

@Component({
  selector: 'app-absence',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    TablerIconsModule,
    MatDividerModule,
  ],
  templateUrl: './absence.component.html',
  styleUrls: ['./absence.component.scss'],
})
export class AbsenceComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('justificationDialog') justificationDialog!: TemplateRef<any>;
  @ViewChild('justificationDetailsDialog') justificationDetailsDialog!: TemplateRef<any>;

  courseId: number = 0;
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [
    '#',
    'name',
    'email',
    'justified',
    'nonJustified',
    'validatedJustifications', // Nouvelle colonne
    'rejectedJustifications', // Nouvelle colonne
    'total',
    'addAbsence',
    'justifications',
  ];

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private absenceService: AbsenceService,
    public authService: AuthService,
    public colorService: ColorService
  ) {}

  ngOnInit(): void {
    this.route.parent?.params.subscribe((params) => {
      this.courseId = +params['id'];
      this.loadAbsences();
    });
  
    // Définir les colonnes en fonction du rôle de l'utilisateur
    if (this.authService.isStudent()) {
      this.displayedColumns = ['#', 'date', 'confirmed', 'justification'];
    } else if (this.authService.isTeacher()) {
      this.displayedColumns = [
        '#',
        'name',
        'email',
        'justified',
        'nonJustified',
        'validatedJustifications',
        'rejectedJustifications',
        'total',
        'addAbsence',
        'justifications',
      ];
    }
  }

  // Méthode pour vérifier si l'étudiant est éliminé
  isEliminated(): boolean {
    if (!this.authService.isStudent()) {
      return false;
    }

    const totalRejectedAndNonJustified = this.dataSource.data.reduce((total, absence) => {
      return total + (!absence.justified ? 0 : 1) + (absence.justified && !absence.confirmed ? 1 : 0);
    }, 0);

    return totalRejectedAndNonJustified > 3;
  }

  // Méthode pour ouvrir la boîte modale de justification (pour les étudiants)
  openJustificationDialog(element: any): void {
    if (element.justification) {
      alert('Vous avez déjà soumis une justification pour cette absence.');
      return;
    }

    const dialogRef = this.dialog.open(this.justificationDialog, {
      width: '400px',
      data: { justification: element.justification || '' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.submitJustification(element, result);
      }
    });
  }

  // Méthode pour confirmer une justification
  confirmJustification(absence: any): void {
    if (!absence.id) {
      console.error('Absence ID is missing');
      return;
    }

    this.absenceService.validateAbsence(absence.id).subscribe({
      next: (response) => {

        // Mettre à jour les données locales
        absence.confirmed = true;
        absence.justification = null;
        absence.status = 'confirmée';

        // Recharger les données pour refléter les changements
        this.loadAbsences();
      },
      error: (error) => {
        console.error('Error confirming absence:', error);
      },
    });
  }

  // Méthode pour rejeter une justification
  rejectJustification(absence: any): void {
    if (!absence.id) {
      console.error('Absence ID is missing');
      return;
    }

    this.absenceService.rejectAbsence(absence.id).subscribe({
      next: (response) => {
        // Mettre à jour les données locales
        absence.confirmed = false;
        absence.justification = null;
        absence.justified = true;
        absence.status = 'rejetée';

        // Recharger les données pour refléter les changements
        this.loadAbsences();
      },
      error: (error) => {
        console.error('Error rejecting absence:', error);
      },
    });
  }

  // Méthode pour soumettre la justification (pour les étudiants)
  submitJustification(element: any, justification: string): void {
    this.absenceService.justifyAbsence(element.id, justification).subscribe({
      next: () => {
        element.justification = justification;
        element.confirmed = false;
        element.justified = true;

        // Recharger les données pour refléter les changements
        this.loadAbsences();
      },
      error: (error) => {
        console.error('Error justifying absence:', error);
      },
    });
  }

  // Méthode pour ouvrir la boîte modale des détails des justifications (pour les enseignants)
  openJustificationDetailsDialog(element: any): void {
    const pendingAbsences = element.absences.filter(
      (absence: any) => absence.justification && !absence.confirmed
    );

    this.dialog.open(this.justificationDetailsDialog, {
      width: '500px',
      data: { absences: pendingAbsences },
    });
  }

  loadAbsences(): void {
    if (!this.courseId) {
      console.error('Course ID is not defined.');
      return;
    }

    const courseId = this.courseId.toString();

    if (this.authService.isStudent()) {
      // Charger les absences pour un étudiant
      this.absenceService.getStudentAbsences(courseId).subscribe({
        next: (absences: any[]) => {
          this.dataSource.data = absences.map((absence) => ({
            ...absence,
            justificationConfirmed: absence.justification && absence.confirmed,
          }));
        },
        error: (error) => {
          console.error('Error fetching student absences:', error);
        },
      });
    } else if (this.authService.isTeacher()) {
      // Charger les absences pour un enseignant
      this.absenceService.getAbsenceCounts(courseId).subscribe({
        next: (absenceData: any[]) => {
          // Mapper les données pour correspondre à la structure attendue par le tableau
          const formattedData = absenceData.map((student) => ({
            student: {
              id: student.id, // Assurez-vous que l'ID de l'étudiant est inclus
              firstName: student.firstName,
              lastName: student.lastName,
              email: student.email,
            },
            absenceCounts: {
              justifiedCount: student.absenceCounts.justifiedCount,
              nonJustifiedCount: student.absenceCounts.nonJustifiedCount,
              validatedJustifications: student.absenceCounts.validatedJustifications, // Justifications validées
              rejectedJustifications: student.absenceCounts.rejectedJustifications, // Justifications rejetées
              totalCount: student.absenceCounts.totalCount,
            },
            absences: student.absences.map((absence: any) => ({
              id: absence.id, // Assurez-vous que l'ID de l'absence est inclus
              date: absence.date,
              justified: absence.justified,
              justification: absence.justification,
              confirmed: absence.confirmed,
            })),
          }));

          this.dataSource.data = formattedData;
        },
        error: (error) => {
          console.error('Error fetching absence counts:', error);
        },
      });
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // Définir une logique de filtrage personnalisée
    this.dataSource.filterPredicate = (data: any, filter: string): boolean => {
      const searchTerms = filter.toLowerCase();
      return (
        data.student.firstName.toLowerCase().includes(searchTerms) ||
        data.student.lastName.toLowerCase().includes(searchTerms) ||
        data.student.email.toLowerCase().includes(searchTerms)
      );
    };
  }

  addAbsence(element: any): void {
    if (!this.courseId) {
      console.error('Course ID is not defined.');
      return;
    }

    const absenceData = {
      studentId: element.student.id,
      courseId: this.courseId,
      date: new Date().toISOString(),
      justified: false,
      justification: '',
    };

    this.absenceService.addAbsence(absenceData).subscribe({
      next: (response) => {
        this.loadAbsences();
      },
      error: (error) => {
        console.error('Error adding absence:', error);
      },
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Méthode pour vérifier si la ligne doit être colorée en rouge
  shouldHighlightRow(element: any): boolean {
    if (!this.authService.isTeacher()) {
      return false; // Pas de coloration si l'utilisateur n'est pas un enseignant
    }
    const totalRejectedAndNonJustified = 
      element.absenceCounts.rejectedJustifications + element.absenceCounts.nonJustifiedCount;
    return totalRejectedAndNonJustified > 3;
  }
}