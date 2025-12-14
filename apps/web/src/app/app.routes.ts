import { Route } from '@angular/router';
import { isUserLogged } from '@feature/auth';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('@feature/home').then((m) => m.HomePage),
  },
  {
    path: '',
    loadComponent: () =>
      import('./core/framework/framework.component').then((m) => m.FrameworkComponent),
    children: [
      {
        path: 'tasks',
        loadChildren: () => import('@feature/tasks').then((m) => m.tasksRoutes),
      },
      {
        path: '404',
        pathMatch: 'full',
        loadComponent: () => import('@feature/not-found').then((m) => m.NotFoundPage),
      },
    ],
    canActivate: [isUserLogged],
  },
  {
    path: '**',
    redirectTo: '404',
  },
];
