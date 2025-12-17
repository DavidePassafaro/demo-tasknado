import { Injectable, computed, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import * as ProjectsSelectors from './projects.selectors';
import { ProjectsApiActions } from './projects.actions';
import { ProjectInput, ProjectUpdate } from '@shared/models';

@Injectable({ providedIn: 'root' })
export class ProjectsFacade {
  private store = inject(Store);

  // Signals
  readonly projects = this.store.selectSignal(ProjectsSelectors.selectProjects);
  readonly loading = this.store.selectSignal(ProjectsSelectors.selectProjectsLoading);
  readonly error = this.store.selectSignal(ProjectsSelectors.selectProjectsError);

  // Computed signals
  readonly hasProjects = computed(() => this.projects().length > 0);
  readonly hasError = computed(() => this.error() !== null);

  // Actions
  loadProjects() {
    this.store.dispatch(ProjectsApiActions.loadProjects());
  }

  createProject(project: ProjectInput) {
    this.store.dispatch(ProjectsApiActions.createProject({ project }));
  }

  updateProject(id: number, changes: ProjectUpdate) {
    this.store.dispatch(ProjectsApiActions.updateProject({ id, changes }));
  }

  deleteProject(id: number) {
    this.store.dispatch(ProjectsApiActions.deleteProject({ id }));
  }

  selectProjectById(id: number) {
    return this.store.selectSignal(ProjectsSelectors.selectProjectById(id));
  }
}
