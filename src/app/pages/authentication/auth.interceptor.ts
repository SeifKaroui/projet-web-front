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

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private authService = inject(AuthService);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem(APP_CONST.tokenLocalStorageKey);

    if (token) {
      request = request.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('AuthInterceptor => Request error:', error.status, error.message);

        if (error.status === 401 && localStorage.getItem('refresh_token')) {
          console.warn('AuthInterceptor => 401 detected, attempting refresh token');
          
          return this.authService.refreshToken().pipe(
            switchMap(() => {
              const newToken = localStorage.getItem(APP_CONST.tokenLocalStorageKey);
              const cloned = request.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } });
              return next.handle(cloned);
            }),
            catchError(refreshError => {
              console.error('AuthInterceptor => Refresh failed', refreshError.message);
              this.authService.signOut();
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