import { Component, inject, computed, ChangeDetectionStrategy, signal } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { Router, ActivatedRoute } from '@angular/router';
import { CreateTaskComponent } from '../../components/create-task/create-task.component';
import { TaskCardComponent } from '../../components/task-card/task-card.component';
import { TasksService } from '../../services/tasks.service';
import { ProjectsService } from '../../services/projects.service';
import { Project, Task } from '@shared/models';

interface TaskInput {
  title: string;
  description: string;
}

@Component({
  selector: 'tn-project-tasklist',
  templateUrl: './project-tasklist.component.html',
  styleUrl: './project-tasklist.component.scss',
  imports: [CreateTaskComponent, TaskCardComponent, ScrollingModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectTasklistComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private tasksService = inject(TasksService);
  private projectsService = inject(ProjectsService);

  protected projectId = signal<number>(0);
  protected project = computed(() => this.getProject());

  protected tasks = computed(() => this.tasksService.tasks());

  constructor() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const projectId = parseInt(idParam, 10);
      if (!isNaN(projectId)) this.projectId.set(projectId);
    }
  }

  /**
   * Handles the creation of a new task
   * @param taskInput The input data for the new task
   */
  protected onTaskCreated(taskInput: TaskInput): void {
    this.tasksService.addTask({
      title: taskInput.title,
      description: taskInput.description,
      projectId: this.projectId(),
    });
  }

  /**
   * Deletes a task by its ID
   * @param id The ID of the task to delete
   */
  protected deleteTask(id: number): void {
    this.tasksService.deleteTask(id);
  }

  /**
   * Toggles the completion status of a task
   * @param id The ID of the task to toggle
   */
  protected toggleTask(id: number): void {
    const task = this.tasksService.getTask(id);
    if (task) {
      this.tasksService.updateTask(id, { status: 'completed' });
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

    return this.projectsService.projects().find((p) => p.id === id) || null;
  }
}
