import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Homework } from '../models/homework.model';
import { CreateHomeworkDTO } from '../models/create-homework-dto';
import { HomeworkSubmission } from '../models/homework-submission';

@Injectable({
  providedIn: 'root',
})
export class HomeworkService {
  private API_URL = 'http://localhost:3000';

  constructor(private http: HttpClient) { }


  getHomeworkByCourse(courseId: number): Observable<Homework[]> {

    return this.http.get<Homework[]>(
      `${this.API_URL}/homework/course/${courseId}`

    );
  }


  getHomeworkById(id: number): Observable<Homework> {

    return this.http.get<Homework>(`${this.API_URL}/homework/${id}`);
  }

  createHomework(
    createHomeworkDTO: CreateHomeworkDTO,
    files: File[],
  ): Observable<any> {
    const formData = new FormData();

    // Append form data
    formData.append('title', createHomeworkDTO.title);
    formData.append('description', createHomeworkDTO.description);
    formData.append('deadline', createHomeworkDTO.deadline);
    formData.append('courseId', createHomeworkDTO.courseId.toString());

    // Append files to FormData
    files.forEach((file) => {
      formData.append('files', file, file.name);
    });

    console.log('formData')
    console.log(formData)

    return this.http.post<any>(`${this.API_URL}/homework`, formData);
  }

  deleteHomework(id: number): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/homework/${id}`);
  }

  fetchAllStudentSubmissionsInHomework(homeworkId: number): Observable<HomeworkSubmission[]> {
    return this.http.get<any>(`${this.API_URL}/homework-submissions/${homeworkId}/students-submissions`);
  }

  fetchStudentSubmissions(homeworkId: number): Observable<HomeworkSubmission[]> {
    return this.http.get<any>(`${this.API_URL}/homework-submissions/student-work/${homeworkId}`);
  }

  createSubmission(
    files: File[],
  ): Observable<any> {
    const formData = new FormData();


    // Append files to FormData
    files.forEach((file) => {
      formData.append('files', file, file.name);
    });


    return this.http.post<any>(`${this.API_URL}/homework`, formData);
  }
}