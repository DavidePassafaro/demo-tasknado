import { Component, inject, computed, ChangeDetectionStrategy, signal } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { Router, ActivatedRoute } from '@angular/router';
import { CreateEntityComponent } from '../../components/create-entity/create-entity.component';
import { TaskCardComponent } from '@shared/ui';
import { TasksFacade, ProjectsFacade } from '@shared/state-management';
import { Project, Task } from '@shared/models';
import { EntityInput } from '../../components/edit-entity/edit-entity.component';

@Component({
  selector: 'tn-project-tasklist',
  templateUrl: './project-tasklist.component.html',
  styleUrl: './project-tasklist.component.scss',
  imports: [CreateEntityComponent, TaskCardComponent, ScrollingModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectTasklistComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private tasksFacade = inject(TasksFacade);
  private projectsFacade = inject(ProjectsFacade);

  protected projectId = signal<number>(0);
  protected project = computed(() => this.getProject());

  protected tasks = computed(() => this.tasksFacade.tasks());

  constructor() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const projectId = parseInt(idParam, 10);
      if (!isNaN(projectId)) {
        this.projectId.set(projectId);
        this.tasksFacade.loadTasks(projectId);
      }
    }
  }

  /**
   * Handles the creation of a new task
   * @param taskInput The input data for the new task
   */
  protected onTaskCreated(taskInput: EntityInput): void {
    this.tasksFacade.createTask({
      title: taskInput.name,
      description: taskInput.description,
      projectId: this.projectId(),
    });
  }

  /**
   * Deletes a task by its ID
   * @param id The ID of the task to delete
   */
  protected deleteTask(id: number): void {
    this.tasksFacade.deleteTask(id);
  }

  /**
   * Toggles the completion status of a task
   * @param id The ID of the task to toggle
   */
  protected toggleTask(id: number): void {
    const task = this.tasksFacade.selectTaskById(id)();
    if (task) {
      this.tasksFacade.updateTask(id, { status: 'completed' });
    }
  }

  /**
   * Navigates to the detail view of a selected task
   * @param task The selected task
   */
  protected onTaskSelected(task: Task): void {
    this.router.navigate(['/projects', this.projectId(), 'task', task.id]);
  }

  /**
   * Track by function for virtual scroll optimization
   * @param index The index of the task
   * @param task The task object
   * @returns The task ID for tracking
   */
  protected trackByTaskId(index: number, task: Task): number {
    return task.id;
  }

  /**
   * Retrieves the current project based on the projectId signal
   * @returns The current Project or null if not found
   */
  private getProject(): Project | null {
    const id = this.projectId();

    if (!id) return null;

    return this.projectsFacade.projects().find((p) => p.id === id) || null;
  }
}
