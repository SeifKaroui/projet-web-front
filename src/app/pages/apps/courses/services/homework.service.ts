import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Homework } from '../models/homework.model';

@Injectable({
  providedIn: 'root',
})
export class HomeworkService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getHomeworksByCourseId(courseId: number): Observable<Homework[]> {
    return this.http.get<Homework[]>(`${this.apiUrl}/homework/course/${courseId}`);
  }

  createHomework(homework: any): Observable<Homework> {
    return this.http.post<Homework>(`${this.apiUrl}/homework`, homework);
  }
}