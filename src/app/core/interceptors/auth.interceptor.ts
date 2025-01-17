// src/app/core/interceptors/auth.interceptor.ts
import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.services'; // Importez votre service d'authentification

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
    const authService = inject(AuthService);
    const authToken = authService.getToken();
  
    if (authToken) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`, // Ajoutez le token dans l'en-tête Authorization
        },
      });
      return next(authReq);
    }
  
    return next(req);
  };