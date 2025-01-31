import { RouterModule } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { TablerIconsModule } from 'angular-tabler-icons';
import { ColorService } from '../../services/color.service';
import { AuthService } from '../../../../authentication/service/auth.service'; // Importez le service AuthService
import { CreateCourseDialogComponent } from '../create-course-dialog/create-course-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-courses',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss'],
  standalone: true,
  imports: [
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatDividerModule,
    TablerIconsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class CourseListComponent implements OnInit {
  courseCode: string;
  onSubmit() {
    this.courseService.joinCourse(this.courseCode).subscribe();
  }
  courses: Course[] = []; // Liste filtrée
  allCourses: Course[] = []; // Liste complète
  selectedCategory = 'All';
  isLoading = false;
  error: string | null = null;

  @ViewChild('searchInput') searchInput: any; // Référence à l'input de recherche

  constructor(
    private courseService: CourseService,
    public colorService: ColorService,
    public authService: AuthService,
    private dialog: MatDialog // Injectez le service AuthService
  ) {}

  ngOnInit(): void {
    this.loadCourses();
  }
  openCreateCourseDialog() {
    const dialogRef = this.dialog.open(CreateCourseDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadCourses();
      }
    });
  }
  
  loadCourses(): void {
    this.isLoading = true;
    this.error = null;

    // Afficher le rôle de l'utilisateur dans la console
    const user = this.authService.getCurrentUser();

    if (this.authService.isStudent()) {

      // Charger les cours auxquels l'étudiant est inscrit
      this.courseService.getEnrolledCourses().subscribe({
        next: (data: Course[]) => {
          this.allCourses = data; // Stocker la liste complète
          this.courses = data; // Initialiser la liste filtrée
          this.isLoading = false;
        },
        error: (error: any) => {
          this.error = 'Erreur lors du chargement des cours.';
          this.isLoading = false;
          console.error('Erreur lors du chargement des cours :', error);
        },
      });
    } else if (this.authService.isTeacher()) {

      // Charger les cours créés par l'enseignant
      this.courseService.getMyCourses().subscribe({
        next: (data: Course[]) => {
          this.allCourses = data; // Stocker la liste complète
          this.courses = data; // Initialiser la liste filtrée
          this.isLoading = false;
        },
        error: (error: any) => {
          this.error = 'Erreur lors du chargement des cours.';
          this.isLoading = false;
          console.error('Erreur lors du chargement des cours :', error);
        },
      });
    } else {
      this.error = 'Rôle utilisateur non reconnu.';
      this.isLoading = false;
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue) {
      this.courses = this.filter(filterValue); // Appliquer le filtre
    } else {
      this.courses = [...this.allCourses]; // Réinitialiser à la liste complète
    }
  }

  filter(v: string): Course[] {
    return this.allCourses.filter(
      (x: Course) => x.title.toLowerCase().indexOf(v.toLowerCase()) !== -1
    );
  }

  deleteCourse(courseId: number): void {
    this.courseService.deleteCourse(courseId).subscribe({
      next: () => {
        // Supprimer le cours de `allCourses`
        this.allCourses = this.allCourses.filter(
          (course) => course.id !== courseId
        );
        // Mettre à jour `courses` pour refléter la suppression
        this.courses = this.courses.filter((course) => course.id !== courseId);
        // Réinitialiser la barre de recherche après la suppression
        if (this.searchInput) {
          this.searchInput.nativeElement.value = '';
        }
      },
      error: (error: any) => {
        console.error('Erreur lors de la suppression du cours :', error);
      },
    });
  }

  storeCourseInLocalStorage(course: Course): void {
    localStorage.setItem('currentCourse', JSON.stringify(course));
  }
}
