import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Homework } from '../models/homework.model';
import { Student } from '../models/Student.model';
import { HomeworkSubmission } from '../models/homeworkSubmission.model';

@Injectable({ providedIn: 'root' })
export class GradingService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  // Get all homeworks for a specific course
  getHomeworksByCourse(courseId: number): Observable<Homework[]> {
    return this.http.get<Homework[]>(`${this.apiUrl}/homework/course/${courseId}`);
  }

  // Get all students enrolled in a course
  getStudentsByCourse(courseId: number): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiUrl}/courses/${courseId}/students`);
  }

  // Get submissions for a specific homework
  getSubmissionsByHomework(homeworkId: number): Observable<HomeworkSubmission[]> {
    return this.http.get<HomeworkSubmission[]>(
      `${this.apiUrl}/homework-submissions/${homeworkId}/students-submissions`
    );
  }

  // Update the grade and feedback for a submission
  updateGrade(
    submissionId: number,
    data: { grade: number; feedback?: string }
  ): Observable<HomeworkSubmission> {
    return this.http.patch<HomeworkSubmission>(
      `${this.apiUrl}/homework-submissions/${submissionId}/grade`,
      data
    );
  }
}
