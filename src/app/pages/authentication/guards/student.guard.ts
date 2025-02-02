import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { APP_CONST } from '../app-constantes.config';
import { APP_ROUTES } from '../app-routes.config';
import { AuthService } from '../services/auth.service';

export const studentGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate([APP_ROUTES.login]);
    return false;
  }

  const userType = localStorage.getItem(APP_CONST.userTypeLocalStorageKey);

  if (userType !== 'student') {
    router.navigate([APP_ROUTES.unauthorized]);
    return false;
  }

  return true;
};