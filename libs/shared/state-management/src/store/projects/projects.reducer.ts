import { createReducer, on } from '@ngrx/store';
import { ProjectsApiActions } from './projects.actions';
import { Project } from '@shared/models';

export interface ProjectsState {
  projects: Project[];
  loading: boolean;
  error: string | null;
}

const initialProjectsState: ProjectsState = {
  projects: [],
  loading: false,
  error: null,
};

export const projectsReducer = createReducer(
  initialProjectsState,

  // Load Projects
  on(ProjectsApiActions.loadProjects, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ProjectsApiActions.loadProjectsSuccess, (state, { projects }) => ({
    ...state,
    projects,
    loading: false,
  })),
  on(ProjectsApiActions.loadProjectsError, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Create Project
  on(ProjectsApiActions.createProject, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ProjectsApiActions.createProjectSuccess, (state, { project }) => ({
    ...state,
    projects: [...state.projects, project],
    loading: false,
  })),
  on(ProjectsApiActions.createProjectError, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update Project
  on(ProjectsApiActions.updateProject, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ProjectsApiActions.updateProjectSuccess, (state, { project }) => ({
    ...state,
    projects: state.projects.map((p) => (p.id === project.id ? project : p)),
    loading: false,
  })),
  on(ProjectsApiActions.updateProjectError, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Delete Project
  on(ProjectsApiActions.deleteProject, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ProjectsApiActions.deleteProjectSuccess, (state, { id }) => ({
    ...state,
    projects: state.projects.filter((p) => p.id !== id),
    loading: false,
  })),
  on(ProjectsApiActions.deleteProjectError, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
