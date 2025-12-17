import { Component, inject, computed, signal, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe, CommonModule } from '@angular/common';
import { EditEntityComponent, EntityInput } from '../../components/edit-entity/edit-entity.component';
import { TasksFacade } from '@shared/state-management';
import { Task } from '@shared/models';

@Component({
  selector: 'tn-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.scss',
  imports: [DatePipe, CommonModule, EditEntityComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskDetailComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private tasksFacade = inject(TasksFacade);

  protected taskId = signal<number>(0);
  protected isEditMode = signal(false);

  protected task = computed(() => this.getTask());
  protected isTaskStatusCompleted = computed(() => this.task()?.status === 'completed');

  constructor() {
    const idParam = this.route.snapshot.paramMap.get('taskId');
    if (idParam) {
      const taskId = parseInt(idParam, 10);
      if (!isNaN(taskId)) this.taskId.set(taskId);
    }
  }

  /**
   * Navigates back to the project task list
   */
  protected goBack(): void {
    this.router.navigate(['/projects', this.route.snapshot.paramMap.get('id')]);
  }

  /**
   * Toggles the completion status of the task
   */
  protected toggleTask(): void {
    const currentTask = this.task();
    if (currentTask) {
      this.tasksFacade.updateTask(currentTask.id, {
        status: currentTask.status === 'completed' ? 'pending' : 'completed',
      });
    }
  }

  /**
   * Enters edit mode for the task
   */
  protected startEdit(): void {
    this.isEditMode.set(true);
  }

  /**
   * Saves the edited task details
   * @param taskInput The edited task details
   */
  protected saveEdit(taskInput: EntityInput): void {
    const currentTask = this.task();
    if (currentTask) {
      this.tasksFacade.updateTask(currentTask.id, {
        title: taskInput.name,
        description: taskInput.description,
      });
      this.isEditMode.set(false);
    }
  }

  /**
   * Cancels the edit mode without saving changes
   */
  protected cancelEdit(): void {
    this.isEditMode.set(false);
  }

  /**
   * Deletes the current task after confirmation and navigates back to the project task list
   */
  protected deleteTask(): void {
    const currentTask = this.task();
    if (currentTask && confirm('Are you sure you want to delete this task?')) {
      this.tasksFacade.deleteTask(currentTask.id);
      this.router.navigate(['/projects', this.route.snapshot.paramMap.get('id')]);
    }
  }

  /**
   * Retrieves the current task based on the taskId signal
   * @returns The current task or null if not found
   */
  private getTask(): Task | null {
    const id = this.taskId();
    if (!id) return null;
    const task = this.tasksFacade.selectTaskById(id)();
    return task || null;
  }
}
