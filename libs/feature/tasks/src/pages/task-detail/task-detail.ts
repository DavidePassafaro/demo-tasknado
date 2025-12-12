import { Component, inject, computed, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { TasksService } from '../../services/tasks.service';

@Component({
  selector: 'tn-task-detail',
  templateUrl: './task-detail.html',
  styleUrl: './task-detail.scss',
  imports: [DatePipe],
})
export class TaskDetailComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private tasksService = inject(TasksService);

  taskId = signal<number | null>(null);

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
      currentTask.completed = !currentTask.completed;
    }
  }

  editTask() {
    // TODO: Implementare la pagina di edit
    console.log('Edit task:', this.task());
  }

  deleteTask() {
    if (confirm('Are you sure you want to delete this task?')) {
      // TODO: Emettere evento per eliminare il task
      this.router.navigate(['/tasks']);
    }
  }
}
