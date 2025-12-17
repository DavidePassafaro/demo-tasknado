import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { map, tap } from 'rxjs';

/**
 * Guard to check if the user is logged in
 */
export const isUserLogged: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.getCurrentUser$().pipe(
    map((user) => {
      if (!user) {
        const homePath = router.parseUrl('/');
        return new RedirectCommand(homePath);
      }

      return true;
    })
  );
};

/**
 * Guard to check if the user is not logged in
 */
export const isUserNotLogged: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.getCurrentUser$().pipe(
    map((user) => {
      if (!!user) {
        const homePath = router.parseUrl('/dashboard');
        return new RedirectCommand(homePath);
      }

      return true;
    })
  );
};
