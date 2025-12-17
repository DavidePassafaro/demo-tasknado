import { Injectable, computed, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { TasksApiActions } from './tasks.actions';
import * as TasksSelectors from './tasks.selectors';
import { TaskInput, TaskUpdate } from '@shared/models';

@Injectable({ providedIn: 'root' })
export class TasksFacade {
  private store = inject(Store);

  // Signals
  readonly tasks = this.store.selectSignal(TasksSelectors.selectTasks);
  readonly loading = this.store.selectSignal(TasksSelectors.selectTasksLoading);
  readonly error = this.store.selectSignal(TasksSelectors.selectTasksError);

  // Computed signals
  readonly hasTasks = computed(() => this.tasks().length > 0);
  readonly hasError = computed(() => this.error() !== null);

  // Actions
  loadTasks(projectId: number) {
    this.store.dispatch(TasksApiActions.loadTasks({ projectId }));
  }

  createTask(task: TaskInput) {
    this.store.dispatch(TasksApiActions.createTask({ task }));
  }

  updateTask(id: number, changes: TaskUpdate) {
    this.store.dispatch(TasksApiActions.updateTask({ id, changes }));
  }

  deleteTask(id: number) {
    this.store.dispatch(TasksApiActions.deleteTask({ id }));
  }

  selectTaskById(id: number) {
    return this.store.selectSignal(TasksSelectors.selectTaskById(id));
  }
}
