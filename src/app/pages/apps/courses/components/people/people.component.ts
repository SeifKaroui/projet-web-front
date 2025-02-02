import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { ColorService } from '../../services/color.service';
import { Course, Teacher } from '../../models/course.model';
import { StudentService } from '../../services/student.service';
import { AuthService } from '../../../../authentication/services/auth.service';

@Component({
  selector: 'app-people',
  standalone: true,
  imports: [MatCardModule, CommonModule],
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss'],
})
export class PeopleComponent implements OnInit {
  courseId: number = 0;
  isTeacher: boolean = false;
  students: any[] = [];
  teacher: Teacher | null = null;

  constructor(
    private route: ActivatedRoute,
    private colorService: ColorService,
    private studentService: StudentService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    // Récupérer les données du teacher passées via le routage
    const teacherData = history.state.teacher;

    if (!teacherData) {
      console.error('Aucune donnée de teacher reçue dans PeopleComponent.');
    } else {
      // Stocker les données du teacher dans une propriété du composant
      this.teacher = teacherData;
    }

    // Charger les étudiants
    this.route.parent?.params.subscribe((params) => {
      this.courseId = +params['id'];
      this.isTeacher = this.authService.isTeacher();
      this.loadStudents(this.courseId);
    });
  }

  loadStudents(courseId: number): void {
    this.studentService.getStudentsByCourseId(courseId).subscribe({
      next: (response: any) => {
        this.students = response.students;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des étudiants :', error);
      },
    });
  }

  getInitial(email: string): string {
    return email.charAt(0).toUpperCase();
  }

  getColor(email: string): string {
    return this.colorService.generateColorFromString(email);
  }
}