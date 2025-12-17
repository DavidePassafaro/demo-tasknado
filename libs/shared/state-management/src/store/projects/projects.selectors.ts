import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProjectsState } from './projects.reducer';

export const projectsFeatureKey = 'projects';
export const selectProjectsState = createFeatureSelector<ProjectsState>(projectsFeatureKey);

export const selectProjects = createSelector(selectProjectsState, (state) => state.projects);

export const selectProjectsLoading = createSelector(selectProjectsState, (state) => state.loading);

export const selectProjectsError = createSelector(selectProjectsState, (state) => state.error);

export const selectProjectById = (id: number) =>
  createSelector(selectProjects, (projects) => projects.find((p) => p.id === id));
