import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../../../pages/authentication/service/auth.service';
import { APP_ROUTES } from '../../../pages/authentication/app-routes.config';
import { StudentAbsence } from './add/student-absence.dto';
import { APP_API } from '../../authentication/app-api.config';
import { StudentAbsenceFlat } from './student/student.component';

@Injectable({
  providedIn: 'root',
})
export class AbsenceService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) { }

  getAbsenceList(courseId: string): Observable<any[]> {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate([APP_ROUTES.login]);
      return throwError(() => new Error('Not authenticated'));
    }

    if (!this.authService.isTeacher()) {
      this.router.navigate([APP_ROUTES.unauthorized]);
      return throwError(() => new Error('Unauthorized access'));
    }

    const url = `${APP_API.baseUrl}/absences/teacher/absence-list?courseId=${courseId}`;
    return this.http.get<any[]>(url).pipe(
      tap((response) => console.log('Absence data received:', response)),
      catchError((error) => {
        this.handleError(error);
        return throwError(() => error);
      })
    );
  }

  getAbsenceCounts(courseId: string): Observable<any[]> {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate([APP_ROUTES.login]);
      return throwError(() => new Error('Not authenticated'));
    }

    if (!this.authService.isTeacher()) {
      this.router.navigate([APP_ROUTES.unauthorized]);
      return throwError(() => new Error('Unauthorized access'));
    }

    const url = `${APP_API.baseUrl}/absences/teacher/count-absence-list?courseId=${courseId}`;
    return this.http.get<any[]>(url).pipe(
      tap((response) => console.log('Absence counts received:', response)),
      catchError((error) => {
        this.handleError(error);
        return throwError(() => error);
      })
    );
  }

  addAbsence(absenceData: any): Observable<any> {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate([APP_ROUTES.login]);
      return throwError(() => new Error('Not authenticated'));
    }

    if (!this.authService.isTeacher()) {
      this.router.navigate([APP_ROUTES.unauthorized]);
      return throwError(() => new Error('Unauthorized access'));
    }

    const url = `${APP_API.baseUrl}/absences/teacher`;
    return this.http.post(url, absenceData).pipe(
      tap((response) => console.log('Absence added:', response)),
      catchError((error) => {
        this.handleError(error);
        return throwError(() => error);
      })
    );
  }

  validateAbsence(absenceId: number, justified: boolean): Observable<any> {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate([APP_ROUTES.login]);
      return throwError(() => new Error('Not authenticated'));
    }

    if (!this.authService.isTeacher()) {
      this.router.navigate([APP_ROUTES.unauthorized]);
      return throwError(() => new Error('Unauthorized access'));
    }

    const url = `${APP_API.baseUrl}/absences/teacher/${absenceId}/validate`;
    return this.http.patch(url, { justified }).pipe(
      tap((response) => console.log('Absence validated:', response)),
      catchError((error) => {
        this.handleError(error);
        return throwError(() => error);
      })
    );
  }

  getStudentAbsences(courseId: string): Observable<StudentAbsenceFlat[]> {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate([APP_ROUTES.login]);
      return throwError(() => new Error('Not authenticated'));
    }

    if (!this.authService.isStudent()) {
      this.router.navigate([APP_ROUTES.unauthorized]);
      return throwError(() => new Error('Unauthorized access'));
    }

    const url = `${APP_API.baseUrl}${APP_API.studentAbsences}?courseId=${courseId}`;
    return this.http.get<StudentAbsenceFlat[]>(url).pipe(
      tap((response) => console.log('Student absences received:', response)),
      catchError((error) => {
        this.handleError(error);
        return throwError(() => error);
      })
    );
  }

  justifyAbsence(absenceId: number, justification: string): Observable<any> {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate([APP_ROUTES.login]);
      return throwError(() => new Error('Not authenticated'));
    }

    if (!this.authService.isStudent()) {
      this.router.navigate([APP_ROUTES.unauthorized]);
      return throwError(() => new Error('Unauthorized access'));
    }

    const url = `${APP_API.baseUrl}/absences/student/${absenceId}/justify`;
    return this.http.patch(url, { justification }).pipe(
      tap((response) => console.log('Absence justified:', response)),
      catchError((error) => {
        this.handleError(error);
        return throwError(() => error);
      })
    );
  }

  rejectAbsence(absenceId: number): Observable<any> {
    const url = `${APP_API.baseUrl}/absences/teacher/${absenceId}/reject`;
    console.log('Making PATCH request to:', url);
  
    return this.http.patch(url, {}).pipe(
      tap((response) => console.log('Absence rejected:', response)),
      catchError((error) => {
        console.error('Error rejecting absence:', error); 
        this.handleError(error);
        return throwError(() => error);
      })
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 401) {
      this.authService.signOut();
      this.router.navigate([APP_ROUTES.login]);
    }
    return throwError(() => error);
  }
}
