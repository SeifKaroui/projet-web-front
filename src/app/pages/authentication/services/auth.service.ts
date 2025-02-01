import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { APP_API } from '../app-api.config';
import { APP_CONST } from '../app-constantes.config';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginResponseDto } from '../DTO/login-response.dto';
import { CredentialsDto } from '../DTO/credentials.dto';
import { SignUpResponseDto } from '../DTO/signup-response.dto';
import { RegisterDto } from '../DTO/register.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  http = inject(HttpClient);
  router = inject(Router);
  snackBar = inject(MatSnackBar);
  constructor() { }
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  refreshToken(): Observable<LoginResponseDto> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token found'));
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${refreshToken}`);

    return this.http.get<LoginResponseDto>(`${APP_API.baseUrl}/auth/refresh`, { headers })
      .pipe(
        tap(response => {
          // Store new access token
          localStorage.setItem(APP_CONST.tokenLocalStorageKey, response.accessToken);

          // Store new refresh token
          localStorage.setItem(APP_CONST.refreshTokenLocalStorageKey, response.refreshToken);

          // Update user data
          localStorage.setItem('user', JSON.stringify(response.user));
        }),
        catchError(error => {
          console.error('AuthService => Refresh token error:', error);
          return throwError(() => error);
        })
      );
  }
  isTeacher(): boolean {
    const user = this.getCurrentUser();
    return user?.type === 'teacher';
  }

  isStudent(): boolean {
    const user = this.getCurrentUser();
    return user?.type === 'student';
  }
  login(credentials: CredentialsDto): Observable<LoginResponseDto> {
    const url = `${APP_API.baseUrl}${APP_API.login}`;

    return this.http.post<LoginResponseDto>(url, credentials, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(
      tap({
        next: (response) => {
          // Store tokens and user data
          localStorage.setItem(APP_CONST.tokenLocalStorageKey, response.accessToken);
          localStorage.setItem(APP_CONST.refreshTokenLocalStorageKey, response.refreshToken);
          localStorage.setItem('user', JSON.stringify(response.user));
        },
        error: (error) => console.error('Login error:', error)
      })
    );
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(APP_CONST.tokenLocalStorageKey);
  }
  register(data: RegisterDto): Observable<SignUpResponseDto> {
    const url = `${APP_API.baseUrl}${APP_API.register}`;

    return this.http.post<SignUpResponseDto>(url, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(
      tap({
        error: (error) => console.error('Register error:', error)
      })
    );
  }
  getRefreshToken(): string | null {
    return localStorage.getItem(APP_CONST.refreshTokenLocalStorageKey);
  }
  getToken(): string | null {
    return localStorage.getItem(APP_CONST.tokenLocalStorageKey);
  }


  signOut() {
    localStorage.removeItem(APP_CONST.tokenLocalStorageKey);
    localStorage.removeItem(APP_CONST.refreshTokenLocalStorageKey);
    localStorage.removeItem('user');
    this.router.navigate([APP_API.login]);
    this.snackBar.open('You have been logged out.', 'Close', {
      duration: 3000,
      panelClass: ['info-snackbar']
    });
  }
}
