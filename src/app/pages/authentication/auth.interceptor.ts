import { Injectable, inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/pages/authentication/service/auth.service';
import { APP_CONST } from 'src/app/pages/authentication/app-constantes.config';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private authService = inject(AuthService);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log('Interceptor: Request URL =', request.url);
    
    if (this.authService.isAuthenticated()) {
      const token = localStorage.getItem(APP_CONST.tokenLocalStorageKey) || '';
      console.log('Interceptor: Token =', token);
      
      const clonedRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Interceptor: Added auth header');
      return next.handle(clonedRequest);
    }
    
    console.log('Interceptor: No auth token');
    return next.handle(request);
  }
}

export const AuthInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: AuthInterceptor,
  multi: true
};