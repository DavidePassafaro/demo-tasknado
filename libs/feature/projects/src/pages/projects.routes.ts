import { ActivatedRouteSnapshot, ResolveFn, Route } from '@angular/router';
import { Task } from '@shared/models';
import { TasksService } from '../services/tasks.service';
import { inject } from '@angular/core';

const projectTasksResolver: ResolveFn<Task[]> = (route: ActivatedRouteSnapshot) => {
  const tasksService = inject(TasksService);
  const projectId = route.paramMap.get('id') || '';
  return tasksService.getTasks(+projectId);
};

export const projectsRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./projects/projects').then((m) => m.Projects),
  },
  {
    path: ':id',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./project-tasklist/project-tasklist').then((m) => m.ProjectTasklistComponent),
      },
      {
        path: 'task/:taskId',
        loadComponent: () => import('./task-detail/task-detail').then((m) => m.TaskDetailComponent),
      },
    ],
    resolve: {
      projectTasks: projectTasksResolver,
    },
  },
];
