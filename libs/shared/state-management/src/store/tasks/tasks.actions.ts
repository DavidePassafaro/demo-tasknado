import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Task, TaskInput } from '@shared/models';

export const TasksApiActions = createActionGroup({
  source: 'Tasks API',
  events: {
    'Load Tasks': emptyProps(),
    'Load Tasks Success': props<{ tasks: Task[] }>(),
    'Load Tasks Error': props<{ error: string }>(),

    'Create Task': props<{ task: TaskInput }>(),
    'Create Task Success': props<{ task: Task }>(),
    'Create Task Error': props<{ error: string }>(),

    'Update Task': props<{ id: number; changes: Partial<TaskInput> }>(),
    'Update Task Success': props<{ task: Task }>(),
    'Update Task Error': props<{ error: string }>(),

    'Delete Task': props<{ id: number }>(),
    'Delete Task Success': props<{ id: number }>(),
    'Delete Task Error': props<{ error: string }>()
  },
});
