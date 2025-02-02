import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AddCourseDTO, Course } from '../models/course.model';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private apiUrl = 'http://localhost:3000'; // URL de base de votre API

  constructor(private http: HttpClient) {}

  // Récupérer les cours auxquels l'étudiant est inscrit
  getEnrolledCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(
      `${this.apiUrl}/courses/my-enrolled-courses`
    );
  }

  // Récupérer les cours créés par l'enseignant
  getMyCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/courses/my-courses`);
  }

  // Récupérer un cours par son ID
  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/courses/${id}`);
  }

  // Supprimer un cours par son ID
  deleteCourse(courseId: number): Observable<void> {
    const url = `${this.apiUrl}/courses/${courseId}`;
    return this.http.delete<void>(url);
  }
  joinCourse(joinCode: string) {
    return this.http.post(`${this.apiUrl}/courses/join`, { code: joinCode });
  }
  createCourse(courseDto:AddCourseDTO){
    return this.http.post(`${this.apiUrl}/courses`,courseDto);
  }
}
