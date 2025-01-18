import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { APP_CONST } from 'src/app/pages/authentication/app-constantes.config';
import { APP_ROUTES } from 'src/app/pages/authentication/app-routes.config';
import { AuthService } from 'src/app/pages/authentication/service/auth.service';

export const authGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);
  if(!authService.isAuthenticated()) {
    router.navigate([APP_ROUTES.login]);
    return false;
  }
  return true;
};