// people.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { ColorService } from '../../services/color.service';
import { Course } from '../../models/course.model'; // Importez le modèle Course
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-people',
  standalone: true,
  imports: [MatCardModule, CommonModule],
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss'],
})
export class PeopleComponent implements OnInit {
  @Input() courseId: number = 0;
  @Input() isTeacher: boolean = false;
  @Input() courseDetail: Course | null = null; 
  students: any[] = [];

  constructor(
    private colorService: ColorService,
    private studentService: StudentService
  ) {}

  ngOnInit(): void {
    this.loadStudents(this.courseId); // Charge les étudiants lors de l'initialisation
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