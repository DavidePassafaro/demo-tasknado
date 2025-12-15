import { ActivatedRouteSnapshot, ResolveFn, Route } from '@angular/router';
import { Project, Task } from '@shared/models';
import { TasksService } from '../services/tasks.service';
import { inject } from '@angular/core';
import { ProjectsService } from '../services/projects.service';

/**
 * Resolver to fetch all projects before activating the route
 * @returns An array of projects
 */
const projectsResolver: ResolveFn<Project[]> = () => {
  const projectsService = inject(ProjectsService);
  return projectsService.getProjects();
};

/**
 * Resolver to fetch tasks for a specific project before activating the route
 * @param route The activated route snapshot
 * @returns An array of tasks for the specified project
 */
const projectTasksResolver: ResolveFn<Task[]> = (route: ActivatedRouteSnapshot) => {
  const tasksService = inject(TasksService);
  const projectId = route.paramMap.get('id') || '';
  return tasksService.getTasks(+projectId);
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
