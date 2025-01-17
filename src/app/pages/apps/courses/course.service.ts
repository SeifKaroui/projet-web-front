// course.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from './course'; // Importez l'interface Course
import { Homework } from './homework'; // Importez l'interface Homework
import { Post } from './Post'; // Importez l'interface Post (à créer)

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private apiUrl = '/api'; // Utiliser le proxy

  constructor(private http: HttpClient) {}

  // Récupérer la liste des cours
  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/courses/my-courses`);
  }

  // Récupérer les détails d'un cours par son ID
  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${id}`);
  }

  // Récupérer les devoirs associés à un cours par son ID
  getHomeworksByCourseId(courseId: number): Observable<Homework[]> {
    return this.http.get<Homework[]>(`${this.apiUrl}/homework/course/${courseId}`);
  }

  // Créer un nouveau devoir
  createHomework(homework: any): Observable<Homework> {
    return this.http.post<Homework>(`${this.apiUrl}/homework`, homework);
  }

  // Récupérer les posts d'un cours par son ID
  getPostsByCourseId(courseId: number): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/courses/${courseId}/posts`);
  }
}