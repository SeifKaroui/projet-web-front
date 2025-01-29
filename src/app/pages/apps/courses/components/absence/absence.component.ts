import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
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
  rejected: boolean; // Nouveau champ pour suivre si la justification est rejetée
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
    'validatedJustifications',
    'rejectedJustifications',
    'total',
    'addAbsence',
    'justifications',
  ];

  isEliminatedFlag: boolean = false; // Variable pour suivre l'état d'élimination
  confirmedAbsencesCount: number = 0; // Nombre d'absences confirmées
  unconfirmedAbsencesCount: number = 0; // Nombre d'absences non confirmées

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private absenceService: AbsenceService,
    public authService: AuthService,
    public colorService: ColorService,
    private changeDetectorRef: ChangeDetectorRef // Injecter ChangeDetectorRef
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

  // Méthode pour calculer les absences confirmées et non confirmées
  calculateConfirmedAndUnconfirmedAbsences(): void {
    if (!this.dataSource.data || this.dataSource.data.length === 0) {
      this.confirmedAbsencesCount = 0;
      this.unconfirmedAbsencesCount = 0;
      return;
    }

    this.confirmedAbsencesCount = this.dataSource.data.filter(
      (absence) => absence.confirmed
    ).length;

    this.unconfirmedAbsencesCount = this.dataSource.data.filter(
      (absence) => !absence.confirmed
    ).length;

    console.log("Absences confirmées : ", this.confirmedAbsencesCount);
    console.log("Absences non confirmées : ", this.unconfirmedAbsencesCount);
  }

  // Méthode pour vérifier si l'étudiant est éliminé
  isEliminated(): boolean {
    if (!this.authService.isStudent()) {
      return false; // Seuls les étudiants peuvent être éliminés
    }

    // Vérifiez que les données sont bien chargées
    if (!this.dataSource.data || this.dataSource.data.length === 0) {
      console.log("Aucune donnée d'absence trouvée.");
      return false;
    }

    // Calcul du total des absences non justifiées et rejetées
    const totalRejectedAndNonJustified = this.dataSource.data.reduce((total, absence) => {
      const isNonJustified = !absence.justified ? 1 : 0; // Absence non justifiée
      const enAttente = absence.justified && !absence.confirmed && !absence.rejected ? 1 : 0; // Justification en attente
      const isRejected = absence.rejected ? 1 : 0; // Justification rejetée
      return total + isNonJustified + isRejected + enAttente;
    }, 0);

    console.log("Total des absences non justifiées et rejetées : ", totalRejectedAndNonJustified);
    console.log("L'étudiant est éliminé : ", totalRejectedAndNonJustified > 3);

    return totalRejectedAndNonJustified > 3;
  }

  // Méthode pour charger les absences
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

          // Mettre à jour l'état d'élimination
          this.isEliminatedFlag = this.isEliminated();

          // Calculer les absences confirmées et non confirmées
          this.calculateConfirmedAndUnconfirmedAbsences();

          // Forcer la détection des changements
          this.changeDetectorRef.detectChanges();
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
              id: student.id,
              firstName: student.firstName,
              lastName: student.lastName,
              email: student.email,
            },
            absenceCounts: {
              justifiedCount: student.absenceCounts.justifiedCount,
              nonJustifiedCount: student.absenceCounts.nonJustifiedCount,
              validatedJustifications: student.absenceCounts.validatedJustifications,
              rejectedJustifications: student.absenceCounts.rejectedJustifications,
              totalCount: student.absenceCounts.totalCount,
            },
            absences: student.absences.map((absence: any) => ({
              id: absence.id,
              date: absence.date,
              justified: absence.justified,
              justification: absence.justification,
              confirmed: absence.confirmed,
              rejected: absence.rejected, // Nouveau champ
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
        absence.rejected = false; // Réinitialiser le statut rejeté

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
        absence.rejected = true; // Marquer comme rejeté

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
        element.rejected = false; // Initialiser à false

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
      (absence: any) => absence.justification && !absence.confirmed && !absence.rejected
    );

    this.dialog.open(this.justificationDetailsDialog, {
      width: '500px',
      data: { absences: pendingAbsences },
    });
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