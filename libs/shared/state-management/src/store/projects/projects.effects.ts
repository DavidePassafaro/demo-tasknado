import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ProjectsApiActions } from './projects.actions';
import { ProjectsService } from '@shared/data-access';

@Injectable()
export class ProjectsEffects {
  private actions$ = inject(Actions);
  private projectsService = inject(ProjectsService);

  loadProjects$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectsApiActions.loadProjects),
      switchMap(() =>
        this.projectsService.getProjects().pipe(
          map((projects) => ProjectsApiActions.loadProjectsSuccess({ projects })),
          catchError((error) => of(ProjectsApiActions.loadProjectsError({ error: error.message })))
        )
      )
    )
  );

  createProject$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectsApiActions.createProject),
      switchMap(({ project }) =>
        this.projectsService.createProject(project).pipe(
          map((createdProject) =>
            ProjectsApiActions.createProjectSuccess({ project: createdProject })
          ),
          catchError((error) => of(ProjectsApiActions.createProjectError({ error: error.message })))
        )
      )
    )
  );

  updateProject$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectsApiActions.updateProject),
      switchMap(({ id, changes }) =>
        this.projectsService.updateProject(id, changes).pipe(
          map((project) => ProjectsApiActions.updateProjectSuccess({ project })),
          catchError((error) => of(ProjectsApiActions.updateProjectError({ error: error.message })))
        )
      )
    )
  );

  deleteProject$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectsApiActions.deleteProject),
      switchMap(({ id }) =>
        this.projectsService.deleteProject(id).pipe(
          map(() => ProjectsApiActions.deleteProjectSuccess({ id })),
          catchError((error) => of(ProjectsApiActions.deleteProjectError({ error: error.message })))
        )
      )
    )
  );
}
