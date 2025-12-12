import { Route } from '@angular/router';
import { Tasks } from './tasks/tasks';
import { TaskDetailComponent } from './task-detail/task-detail';

export const tasksRoutes: Route[] = [
  { path: '', component: Tasks },
  { path: ':id', component: TaskDetailComponent },
];
