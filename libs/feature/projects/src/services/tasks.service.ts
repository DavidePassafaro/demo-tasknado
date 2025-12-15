import { Injectable, signal } from '@angular/core';

export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  tasks = signal<Task[]>([]);

  addTask(task: Task) {
    this.tasks.set([...this.tasks(), task]);
  }

  getTask(id: number): Task | null {
    return this.tasks().find(t => t.id === id) || null;
  }

  getTasks(): Task[] {
    return this.tasks();
  }

  updateTask(id: number, updates: Partial<Task>) {
    const tasks = this.tasks();
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updates };
      this.tasks.set([...tasks]);
    }
  }

  deleteTask(id: number) {
    this.tasks.set(this.tasks().filter(t => t.id !== id));
  }
}
