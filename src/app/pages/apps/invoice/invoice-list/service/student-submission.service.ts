import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StudentSubmission } from 'src/app/pages/apps/invoice/invoice-list/DTO/student-interface.dto';
import { APP_API } from 'src/app/pages/apps/invoice/invoice-list/config/app-api.config';

@Injectable({
  providedIn: 'root'
})
export class StudentSubmissionService {
  constructor(private http: HttpClient) {}

  getStudentSubmissions(homeworkId: string): Observable<StudentSubmission[]> {
    return this.http.get<StudentSubmission[]>(
      `${APP_API.baseUrl}${APP_API.studentSubmissions}`
    );
  }

  updateGrade(submissionId: string, grade: number, comments: string): Observable<StudentSubmission> {
    return this.http.patch<StudentSubmission>(
      `${APP_API.baseUrl}${APP_API.studentSubmissions}/${submissionId}`,
      { grade, comments }
    );
  }

  getSubmissionStats(homeworkId: string): Observable<{submitted: number, notSubmitted: number}> {
    const url = `${APP_API.baseUrl}${APP_API.studentSubmissionStats}`
      .replace('{homeworkId}', homeworkId);
    return this.http.get<{submitted: number, notSubmitted: number}>(url);
  }

  downloadSubmission(submissionId: string): Observable<Blob> {
    return this.http.get(
      `${APP_API.baseUrl}${APP_API.studentSubmissions}/${submissionId}/download`,
      { responseType: 'blob' }
    );
  }
}