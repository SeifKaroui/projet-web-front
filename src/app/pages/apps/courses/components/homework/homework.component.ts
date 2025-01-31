import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HomeworkService } from '../../services/homework.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { CustomDatePipe } from '../../pipes/custom-date.pipe';
import { AuthService } from '../../../../authentication/service/auth.service';

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
    CustomDatePipe,
  ],
  templateUrl: './homework.component.html',
  styleUrls: ['./homework.component.scss'],
})
export class HomeworkComponent implements OnInit {
  courseId: number | null = null; // Récupérer l'ID du cours depuis l'URL
  isTeacher: boolean = false; // Récupérer le statut de l'utilisateur
  homeworks: any[] = [];
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

  constructor(
    private route: ActivatedRoute,
    private homeworkService: HomeworkService,
    private authService: AuthService // Injectez AuthService pour vérifier le statut de l'utilisateur
  ) {}

  ngOnInit(): void {
    this.route.parent?.params.subscribe((params) => {
      this.courseId = +params['id']; // Récupérer l'ID du cours depuis l'URL
      this.isTeacher = this.authService.isTeacher(); // Vérifier si l'utilisateur est un enseignant
      this.loadHomeworks(this.courseId); // Charger les devoirs
    });
  }

  loadHomeworks(courseId: number): void {
    this.homeworkService.getHomeworksByCourseId(courseId).subscribe(
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