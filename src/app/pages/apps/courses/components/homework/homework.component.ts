// homework.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { Homework } from '../../models/homework.model';
import { CourseService } from '../../services/course.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { CustomDatePipe } from "../../pipes/custom-date.pipe";

@Component({
  selector: 'app-homework',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    CommonModule,
    CustomDatePipe
  ],
  templateUrl: './homework.component.html',
  styleUrls: ['./homework.component.scss'],
})
export class HomeworkComponent implements OnInit {
  @Input() courseId: number = 0; // Reçoit l'ID du cours depuis le parent
  @Input() isTeacher: boolean = false;
  homeworks: Homework[] = [];
  isHomeworkFormOpen = false;
  newHomework = {
    title: '',
    description: '',
    day: null as number | null,
    month: null as number | null,
    year: null as number | null,
    time: '',
    courseId: 0,
  };
  isHomeworkSubmitting = false;

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.loadHomeworks(this.courseId); // Charge les devoirs lors de l'initialisation
  }

  loadHomeworks(courseId: number): void {
    this.courseService.getHomeworksByCourseId(courseId).subscribe(
      (homeworks) => {
        this.homeworks = homeworks;
      },
      (error) => {
        console.error('Erreur lors de la récupération des devoirs :', error);
      }
    );
  }

  toggleHomeworkForm(): void {
    this.isHomeworkFormOpen = !this.isHomeworkFormOpen;
  }

  onHomeworkSubmit(): void {
    if (this.isHomeworkSubmitting) return;
    this.isHomeworkSubmitting = true;
  }

  cancelHomeworkForm(): void {
    this.isHomeworkFormOpen = false;
    this.isHomeworkSubmitting = false;
    this.newHomework = { title: '', description: '', day: null, month: null, year: null, time: '', courseId: 0 };
  }
}