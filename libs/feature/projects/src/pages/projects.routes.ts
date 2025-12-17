import { ActivatedRouteSnapshot, ResolveFn, Route } from '@angular/router';
import { Task } from '@shared/models';
import { inject, Injector } from '@angular/core';
import { ProjectsFacade, TasksFacade } from '@shared/state-management';
import { filter, switchMap, take } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

/**
 * Resolver to fetch all projects before activating the route using ProjectsFacade
 * @returns An observable of projects array
 */
const projectsResolver: ResolveFn<boolean> = () => {
  const projectsFacade = inject(ProjectsFacade);
  const injector = inject(Injector);

  // Load projects via facade
  projectsFacade.loadProjects();

  // Wait until loading is complete
  return toObservable(projectsFacade.projects, { injector }).pipe(
    switchMap(() => toObservable(projectsFacade.loading, { injector })),
    filter((loading) => !loading),
    take(1)
  );
};

/**
 * Resolver to fetch tasks for a specific project before activating the route using TasksFacade
 * @param route The activated route snapshot
 * @returns An observable that completes when tasks are loaded
 */
const projectTasksResolver: ResolveFn<boolean> = (route: ActivatedRouteSnapshot) => {
  const tasksFacade = inject(TasksFacade);
  const injector = inject(Injector);

  // Load tasks for the specific project via facade
  const projectId = route.paramMap.get('id') || '';
  tasksFacade.loadTasks(+projectId);

  // Wait until loading is complete
  return toObservable(tasksFacade.tasks, { injector }).pipe(
    switchMap(() => toObservable(tasksFacade.loading, { injector })),
    filter((loading) => !loading),
    take(1)
  );
};

export const projectsRoutes: Route[] = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () => import('./projects/projects.component').then((m) => m.Projects),
      },
      {
        path: ':id',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./project-tasklist/project-tasklist.component').then(
                (m) => m.ProjectTasklistComponent
              ),
          },
          {
            path: 'detail',
            loadComponent: () =>
              import('./project-detail/project-detail.component').then(
                (m) => m.ProjectDetailComponent
              ),
          },
          {
            path: 'task/:taskId',
            loadComponent: () =>
              import('./task-detail/task-detail.component').then((m) => m.TaskDetailComponent),
          },
        ],
        resolve: {
          projectTasks: projectTasksResolver,
        },
      },
    ],
    resolve: {
      projects: projectsResolver,
    },
  },
];
