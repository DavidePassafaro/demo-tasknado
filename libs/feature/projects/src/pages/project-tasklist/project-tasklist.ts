import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { Router, ActivatedRoute } from '@angular/router';
import { CreateTaskComponent } from '../../components/create-task/create-task';
import { TaskCardComponent } from '../../components/task-card/task-card';
import { TasksService, Task } from '../../services/tasks.service';
import { ProjectsService } from '../../services/projects.service';

interface TaskInput {
  title: string;
  description: string;
}

@Component({
  selector: 'tn-project-tasklist',
  templateUrl: './project-tasklist.html',
  styleUrl: './project-tasklist.scss',
  imports: [CreateTaskComponent, TaskCardComponent, ScrollingModule],
  providers: [TasksService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectTasklistComponent {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private tasksService = inject(TasksService);
  private projectsService = inject(ProjectsService);

  projectId = computed(() => {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    return id ? parseInt(id, 10) : null;
  });

  project = computed(() => {
    const id = this.projectId();
    if (!id) return null;
    return this.projectsService.projects().find((p) => p.id === id) || null;
  });

  tasks = computed(() => this.tasksService.tasks());
  nextId = 1;

  constructor() {
    const projectId = this.projectId();
    if (projectId) {
      this.tasksService.getTasks(projectId);
    }
  }

  onTaskCreated(taskInput: TaskInput) {
    this.tasksService.addTask({
      title: taskInput.title,
      description: taskInput.description,
      projectId: this.projectId() || undefined,
    });
  }

  deleteTask(id: number) {
    this.tasksService.deleteTask(id);
  }

  toggleTask(id: number) {
    const task = this.tasksService.getTask(id);
    if (task) {
      this.tasksService.updateTask(id, { completed: !task.completed });
    }
  }

  onTaskSelected(task: Task) {
    this.router.navigate(['/tasks/', task.id]);
  }
}
