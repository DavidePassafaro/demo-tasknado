import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TasksState } from './tasks.reducer';

export const tasksFeatureKey = 'tasks';
export const selectTasksState = createFeatureSelector<TasksState>(tasksFeatureKey);

export const selectTasks = createSelector(selectTasksState, (state) => state.tasks);

export const selectTasksLoading = createSelector(selectTasksState, (state) => state.loading);

export const selectTasksError = createSelector(selectTasksState, (state) => state.error);

export const selectTaskById = (id: number) =>
  createSelector(selectTasks, (tasks) => tasks.find((t) => t.id === id));
