import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Project, ProjectInput, ProjectUpdate } from '@shared/models';

export const ProjectsApiActions = createActionGroup({
  source: 'Projects API',
  events: {
    'Load Projects': emptyProps(),
    'Load Projects Success': props<{ projects: Project[] }>(),
    'Load Projects Error': props<{ error: string }>(),

    'Create Project': props<{ project: ProjectInput }>(),
    'Create Project Success': props<{ project: Project }>(),
    'Create Project Error': props<{ error: string }>(),

    'Update Project': props<{ id: number; changes: ProjectUpdate }>(),
    'Update Project Success': props<{ project: Project }>(),
    'Update Project Error': props<{ error: string }>(),

    'Delete Project': props<{ id: number }>(),
    'Delete Project Success': props<{ id: number }>(),
    'Delete Project Error': props<{ error: string }>(),
  },
});
