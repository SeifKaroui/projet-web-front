import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../../../pages/authentication/service/auth.service';
import { APP_ROUTES } from '../../../pages/authentication/app-routes.config';
import { StudentAbsence } from './add/student-absence.dto';
import { APP_API } from '../../authentication/app-api.config';

@Injectable({
  providedIn: 'root'
})
export class AbsenceService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  getAbsenceList(courseId: string): Observable<StudentAbsence[]> {
    if (!this.authService.isTeacher()) {
      this.router.navigate([APP_ROUTES.unauthorized]);
      return throwError(() => new Error('Unauthorized access'));
    }

    return this.http.get<StudentAbsence[]>(
      `${APP_API.baseUrl}${APP_API.absenceList}?courseId=${courseId}`
    ).pipe(
      tap(response => console.log('Absence data:', response)),
      catchError(this.handleError.bind(this))
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