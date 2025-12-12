import { Component, inject, computed, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe, CommonModule } from '@angular/common';
import { TasksService } from '../../services/tasks.service';
import { CreateTaskComponent } from '../../components/create-task/create-task';

@Component({
  selector: 'tn-task-detail',
  templateUrl: './task-detail.html',
  styleUrl: './task-detail.scss',
  imports: [DatePipe, CommonModule, CreateTaskComponent],
})
export class TaskDetailComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private tasksService = inject(TasksService);

  taskId = signal<number | null>(null);
  isEditMode = signal(false);

  // Computed che trova il task dall'id
  task = computed(() => {
    const id = this.taskId();
    if (!id) return null;
    const task = this.tasksService.getTask(id);
    return task || null;
  });

  constructor() {
    // Leggi l'id dai route params all'inizializzazione
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const taskId = parseInt(idParam, 10);
      if (!isNaN(taskId)) {
        this.taskId.set(taskId);
      }
    }
  }

  goBack() {
    this.router.navigate(['/tasks']);
  }

  toggleTask() {
    const currentTask = this.task();
    if (currentTask) {
      this.tasksService.updateTask(currentTask.id, { 
        completed: !currentTask.completed 
      });
    }
  }

  startEdit() {
    this.isEditMode.set(true);
  }

  saveEdit(taskInput: { title: string; description: string }) {
    const currentTask = this.task();
    if (currentTask) {
      this.tasksService.updateTask(currentTask.id, {
        title: taskInput.title,
        description: taskInput.description,
      });
      this.isEditMode.set(false);
    }
  }

  cancelEdit() {
    this.isEditMode.set(false);
  }

  deleteTask() {
    const currentTask = this.task();
    if (currentTask && confirm('Are you sure you want to delete this task?')) {
      this.tasksService.deleteTask(currentTask.id);
      this.router.navigate(['/tasks']);
    }
  }
}
