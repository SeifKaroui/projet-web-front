import { RouterModule } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CourseService } from './course.service';
import { Course } from './course';
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
import { ColorService } from './color.service'; // Importez le service ColorService

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
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
export class CoursesComponent implements OnInit {
  courses: Course[] = [];
  selectedCategory = 'All';

  constructor(
    private courseService: CourseService,
    public colorService: ColorService // Rendez colorService public
  ) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.courseService.getCourses().subscribe({
      next: (data: Course[]) => {
        this.courses = data;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des cours :', error);
      },
    });
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

  ddlChange(ob: any): void {
    const filterValue = ob.value;
    if (filterValue === 'All') {
      this.loadCourses();
    } else {
      this.courseService.getCourses().subscribe({
        next: (data: Course[]) => {
          this.courses = data.filter(
            (course: Course) => course.type === filterValue
          );
        },
        error: (error: any) => {
          console.error('Erreur lors du filtrage des cours :', error);
        },
      });
    }
  }

  storeCourseInLocalStorage(course: Course): void {
    localStorage.setItem('currentCourse', JSON.stringify(course)); // Stockez l'objet course dans le localStorage
  }
}