import { Injectable, inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from 'src/app/pages/authentication/service/auth.service';
import { APP_CONST } from 'src/app/pages/authentication/app-constantes.config';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Skip interception for the refresh token endpoint to prevent infinite loops
    if (request.url.endsWith('/auth/refresh')) {
      console.log('AuthInterceptor => Skipping interception for:', request.url);
      return next.handle(request);
    }

    const token = this.authService.getToken();

    if (token) {
      request = request.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('AuthInterceptor => Request error:', error.status, error.message);

        if (error.status === 401 && this.authService.refreshToken()) {
          console.warn('AuthInterceptor => 401 detected, attempting refresh token');

          return this.authService.refreshToken().pipe(
            switchMap(() => {
              const newToken = this.authService.getToken();
              console.log('AuthInterceptor => Refresh successful, retrying request with new token');
              const cloned = request.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } });
              return next.handle(cloned);
            }),
            catchError(refreshError => {
              console.error('AuthInterceptor => Refresh failed:', refreshError.message);
              this.authService.signOut();
              
              // Display a user-friendly message
              this.snackBar.open('Session expired. Please log in again.', 'Close', {
                duration: 5000,
                panelClass: ['error-snackbar']
              });

              return throwError(() => refreshError);
            })
          );
        }

        return throwError(() => error);
      })
    );
  }
}

export const AuthInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: AuthInterceptor,
  multi: true
};