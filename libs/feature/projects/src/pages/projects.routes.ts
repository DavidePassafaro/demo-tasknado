import { Route } from '@angular/router';

export const projectsRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./projects/projects').then((m) => m.Projects),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./project-tasklist/project-tasklist').then((m) => m.ProjectTasklistComponent),
  },
  {
    path: ':id/task/:taskId',
    loadComponent: () => import('./task-detail/task-detail').then((m) => m.TaskDetailComponent),
  },
];
