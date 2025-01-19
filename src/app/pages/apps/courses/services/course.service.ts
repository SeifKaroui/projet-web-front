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
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // Récupérer les cours auxquels l'étudiant est inscrit
  getEnrolledCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/courses/my-enrolled-courses`);
  }

  // Récupérer les cours créés par l'enseignant
  getMyCourses(): Observable<Course[]> {
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

  createPost(courseId: number, postData: FormData): Observable<Post> {
    return this.http.post<Post>(`${this.apiUrl}/courses/${courseId}/posts`, postData);
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

  getStudentsByCourseId(courseId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/courses/${courseId}/students`);
  }

  uploadFiles(files: File[]): Observable<File[]> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    return this.http.post<File[]>(`${this.apiUrl}/files/upload`, formData);
  }

  getFileById(fileId: number): Observable<File> {
    return this.http.get<File>(`${this.apiUrl}/files/${fileId}`);
  }

  // Méthode pour obtenir l'URL d'un fichier
  getFileUrl(fileId: number): string {
    return `${this.apiUrl}/files/${fileId}`;
  }

  deletePost(postId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/courses/posts/${postId}`);
  }
}