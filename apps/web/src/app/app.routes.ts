import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('@feature/home').then((m) => m.Home),
  },
  {
    path: '404',
    loadComponent: () => import('@feature/not-found').then((m) => m.NotFound),
  },
  {
    path: '**',
    redirectTo: '404',
  },
];
