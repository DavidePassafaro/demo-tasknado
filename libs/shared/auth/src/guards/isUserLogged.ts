import { CanActivateFn, Router } from '@angular/router';
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
    map((user) => !!user),
    tap((isLoggedIn) => {
      if (!isLoggedIn) router.navigate(['/']);
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
    map((user) => !user),
    tap((isNotLoggedIn) => {
      if (!isNotLoggedIn) router.navigate(['/projects']);
    })
  );
};
