import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { TasksApiActions } from './tasks.actions';
import { TasksService } from '@shared/data-access';

@Injectable()
export class TasksEffects {
  private actions$ = inject(Actions);
  private tasksService = inject(TasksService);

  loadTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksApiActions.loadTasks),
      switchMap(({ projectId }) =>
        this.tasksService.getTasksByProjectId(projectId).pipe(
          map((tasks) => TasksApiActions.loadTasksSuccess({ tasks, projectId })),
          catchError((error) => of(TasksApiActions.loadTasksError({ error: error.message })))
        )
      )
    )
  );

  createTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksApiActions.createTask),
      switchMap(({ task }) =>
        this.tasksService.addTask(task).pipe(
          map((createdTask) => TasksApiActions.createTaskSuccess({ task: createdTask })),
          catchError((error) => of(TasksApiActions.createTaskError({ error: error.message })))
        )
      )
    )
  );

  updateTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksApiActions.updateTask),
      switchMap(({ id, changes }) =>
        this.tasksService.updateTask(id, changes).pipe(
          map((task) => TasksApiActions.updateTaskSuccess({ task })),
          catchError((error) => of(TasksApiActions.updateTaskError({ error: error.message })))
        )
      )
    )
  );

  deleteTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksApiActions.deleteTask),
      switchMap(({ id }) =>
        this.tasksService.deleteTask(id).pipe(
          map(() => TasksApiActions.deleteTaskSuccess({ id })),
          catchError((error) => of(TasksApiActions.deleteTaskError({ error: error.message })))
        )
      )
    )
  );
}
