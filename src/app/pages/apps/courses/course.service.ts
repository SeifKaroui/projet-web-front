import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from './course';
import { Homework } from './homework';
import { Post } from './Post';
import { CourseComment } from './comment'; // Importez l'interface CourseComment

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
      `${this.apiUrl}/courses/${courseId}/posts`, // URL avec courseId
      { content: post.content }, // Corps de la requête
      { headers } // En-têtes
    );
  }

  // Récupérer les commentaires d'un post
  getCommentsByPostId(postId: number): Observable<CourseComment[]> {
    return this.http.get<CourseComment[]>(`${this.apiUrl}/courses/posts/comments/${postId}`);
  }

  // Créer un nouveau commentaire
  createComment(postId: number, comment: { content: string }): Observable<CourseComment> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<CourseComment>(`${this.apiUrl}/courses/posts/${postId}/comments`, comment, { headers });
  }

  // Supprimer un commentaire
deleteComment(postId: number, commentId: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/courses/posts/${postId}/comments/${commentId}`);
}
}