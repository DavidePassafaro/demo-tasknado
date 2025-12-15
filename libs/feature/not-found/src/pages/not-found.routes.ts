import { Route } from '@angular/router';

export const notFoundRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];
