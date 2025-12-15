import { Route } from '@angular/router';
import { isUserNotLogged, isUserLogged } from '@shared/auth';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () => import('@feature/home').then((m) => m.homeRoutes),
    canActivate: [isUserNotLogged],
  },
  {
    path: '',
    loadComponent: () =>
      import('./core/components/framework/framework.component').then((m) => m.FrameworkComponent),
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('@feature/dashboard').then((m) => m.dashboardRoutes),
      },
      {
        path: 'projects',
        loadChildren: () => import('@feature/projects').then((m) => m.projectsRoutes),
      },
      {
        path: '404',
        pathMatch: 'full',
        loadChildren: () => import('@feature/not-found').then((m) => m.notFoundRoutes),
      },
    ],
    canActivate: [isUserLogged],
  },
  {
    path: '**',
    redirectTo: '404',
  },
];
