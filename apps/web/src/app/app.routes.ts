import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('@feature/home').then((m) => m.HomePage),
  },
  {
    path: 'tasks',
    loadChildren: () => import('@feature/tasks').then((m) => m.tasksRoutes),
  },
  {
    path: '404',
    pathMatch: 'full',
    loadComponent: () => import('@feature/not-found').then((m) => m.NotFoundPage),
  },
  {
    path: '**',
    redirectTo: '404',
  },
];
