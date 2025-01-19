import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from '../models/course.model';
import { Homework } from '../models/homework.model';
import { Post } from '../models/post.model';
import { CourseComment } from '../models/comment.model';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/courses/my-courses`);
  }

  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${id}`);
  }

  getHomeworksByCourseId(courseId: number): Observable<Homework[]> {
    return this.http.get<Homework[]>(`${this.apiUrl}/homework/course/${courseId}`);
  }

  createHomework(homework: any): Observable<Homework> {
    return this.http.post<Homework>(`${this.apiUrl}/homework`, homework);
  }

  getPostsByCourseId(courseId: number): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/courses/${courseId}/posts`);
  }

  createPost(courseId: number, post: { content: string }): Observable<Post> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Post>(
      `${this.apiUrl}/courses/${courseId}/posts`,
      { content: post.content },
      { headers }
    );
  }

  getCommentsByPostId(postId: number): Observable<CourseComment[]> {
    return this.http.get<CourseComment[]>(`${this.apiUrl}/courses/posts/comments/${postId}`);
  }

  createComment(postId: number, comment: { content: string }): Observable<CourseComment> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<CourseComment>(`${this.apiUrl}/courses/posts/${postId}/comments`, comment, { headers });
  }

  deleteComment(postId: number, commentId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/courses/posts/${postId}/comments/${commentId}`);
  }

  getAbsencesByCourseId(courseId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/absences/teacher/absence-list?courseId=${courseId}`);
  }

  getStudentsByCourseId(courseId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/courses/${courseId}/students`);
  }

  /*markAbsence(studentId: string, courseId: number, date: string): Observable<any> {
    const body = {
      studentId,
      courseId,
      date,
      justified: false,
      justification: '',
    };
    return this.http.post(`${this.apiUrl}/absences/teacher`, body);
  }

  justifyAbsence(absenceId: number, justification: string): Observable<any> {
    const body = {
      justified: true,
      justification,
    };
    return this.http.patch(`${this.apiUrl}/absences/teacher/${absenceId}/validate`, body);
  }

  deleteAbsence(absenceId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/absences/teacher/${absenceId}`);
  }*/
}