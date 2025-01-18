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
    console.log('Checking auth before request...');
    console.log('Is authenticated:', this.authService.isAuthenticated());
    console.log('Is teacher:', this.authService.isTeacher());
    
    if (!this.authService.isAuthenticated()) {
      console.log('Not authenticated, redirecting to login');
      this.router.navigate([APP_ROUTES.login]);
      return throwError(() => new Error('Not authenticated'));
    }
  
    if (!this.authService.isTeacher()) {
      console.log('Not a teacher, redirecting to unauthorized');
      this.router.navigate([APP_ROUTES.unauthorized]);
      return throwError(() => new Error('Unauthorized access'));
    }
  
    const url = `${APP_API.baseUrl}${APP_API.absenceList}?courseId=${courseId}`;
    console.log('Making request to:', url);
    
    return this.http.get<StudentAbsence[]>(url).pipe(
      tap(response => console.log('Absence data received:', response)),
      catchError(error => {
        console.error('Request error:', error);
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