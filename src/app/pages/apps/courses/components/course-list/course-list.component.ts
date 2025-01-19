import { RouterModule } from '@angular/router';
import { Component, OnInit } from '@angular/core';
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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TablerIconsModule } from 'angular-tabler-icons';
import { ColorService } from '../../services/color.service';
import { AuthService } from '../../../../authentication/service/auth.service'; // Importez le service AuthService

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
  courses: Course[] = [];
  selectedCategory = 'All';
  isLoading = false;
  error: string | null = null;

  constructor(
    private courseService: CourseService,
    public colorService: ColorService,
    private authService: AuthService // Injectez le service AuthService
  ) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.isLoading = true;
    this.error = null;
  
    // Afficher le rôle de l'utilisateur dans la console
    const user = this.authService.getCurrentUser();
    console.log('Utilisateur connecté :', user);
  
    if (this.authService.isStudent()) {
      console.log('Utilisateur : Étudiant');
      console.log('Fonction utilisée : getEnrolledCourses()');
  
      // Charger les cours auxquels l'étudiant est inscrit
      this.courseService.getEnrolledCourses().subscribe({
        next: (data: Course[]) => {
          this.courses = data;
          this.isLoading = false;
        },
        error: (error: any) => {
          this.error = 'Erreur lors du chargement des cours.';
          this.isLoading = false;
          console.error('Erreur lors du chargement des cours :', error);
        },
      });
    } else if (this.authService.isTeacher()) {
      console.log('Utilisateur : Enseignant');
      console.log('Fonction utilisée : getMyCourses()');
  
      // Charger les cours créés par l'enseignant
      this.courseService.getMyCourses().subscribe({
        next: (data: Course[]) => {
          this.courses = data;
          this.isLoading = false;
        },
        error: (error: any) => {
          this.error = 'Erreur lors du chargement des cours.';
          this.isLoading = false;
          console.error('Erreur lors du chargement des cours :', error);
        },
      });
    } else {
      console.log('Rôle utilisateur non reconnu.');
      this.error = 'Rôle utilisateur non reconnu.';
      this.isLoading = false;
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.courses = this.filter(filterValue);
  }

  filter(v: string): Course[] {
    return this.courses.filter(
      (x: Course) => x.title.toLowerCase().indexOf(v.toLowerCase()) !== -1
    );
  }

  storeCourseInLocalStorage(course: Course): void {
    localStorage.setItem('currentCourse', JSON.stringify(course));
  }
}