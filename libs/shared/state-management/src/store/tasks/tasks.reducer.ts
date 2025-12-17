import { createReducer, on } from '@ngrx/store';
import { TasksApiActions } from './tasks.actions';
import { Task } from '@shared/models';
export interface TasksState {
  tasks: Task[];
  projectId: number | null;
  loading: boolean;
  error: string | null;
}

export const initialTasksState: TasksState = {
  tasks: [],
  projectId: null,
  loading: false,
  error: null,
};

export const tasksReducer = createReducer(
  initialTasksState,

  // Load Tasks
  on(TasksApiActions.loadTasks, (state, { projectId }) => ({
    ...state,
    projectId,
    loading: true,
    error: null,
  })),
  on(TasksApiActions.loadTasksSuccess, (state, { tasks }) => ({
    ...state,
    tasks,
    loading: false,
  })),
  on(TasksApiActions.loadTasksError, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Create Task
  on(TasksApiActions.createTask, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(TasksApiActions.createTaskSuccess, (state, { task }) => ({
    ...state,
    tasks: [...state.tasks, task],
    loading: false,
  })),
  on(TasksApiActions.createTaskError, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update Task
  on(TasksApiActions.updateTask, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(TasksApiActions.updateTaskSuccess, (state, { task }) => ({
    ...state,
    tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
    loading: false,
  })),
  on(TasksApiActions.updateTaskError, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Delete Task
  on(TasksApiActions.deleteTask, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(TasksApiActions.deleteTaskSuccess, (state, { id }) => ({
    ...state,
    tasks: state.tasks.filter((t) => t.id !== id),
    loading: false,
  })),
  on(TasksApiActions.deleteTaskError, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
