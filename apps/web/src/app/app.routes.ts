import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '404',
    loadComponent: () => import('@feature/not-found').then((m) => m.NotFound),
  },
  {
    path: '**',
    redirectTo: '404',
  },
];
