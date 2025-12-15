import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Task } from '@shared/models';
import { Observable, tap } from 'rxjs';

const BASE_API_URL = 'http://localhost:4000/';

@Injectable({ providedIn: 'root' })
export class TasksService {
  private readonly http = inject(HttpClient);

  #tasks = signal<Task[]>([]);
  tasks = this.#tasks.asReadonly();

  getTasks(projectId: number): Observable<Task[]> {
    return this.http
      .get<Task[]>(`${BASE_API_URL}api/tasks/project/${projectId}`, { withCredentials: true })
      .pipe(
        tap((response) => {
          this.#tasks.set(response);
        })
      );
  }

  addTask(task: Partial<Task>): void {
    this.http
      .post<Task>(`${BASE_API_URL}api/tasks`, task, { withCredentials: true })
      .subscribe((response) => {
        this.#tasks.set([...this.#tasks(), response]);
      });
  }

  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${BASE_API_URL}api/tasks/${id}`, { withCredentials: true });
  }

  getTasksByProjectId(projectId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${BASE_API_URL}api/projects/${projectId}/tasks`, {
      withCredentials: true,
    });
  }

  updateTask(id: number, updates: Partial<Task>): void {
    this.http
      .put<Task>(`${BASE_API_URL}api/tasks/${id}`, updates, { withCredentials: true })
      .subscribe((updatedTask) => {
        const updatedTasks = this.#tasks().map((task) => (task.id === id ? updatedTask : task));
        this.#tasks.set(updatedTasks);
      });
  }

  deleteTask(id: number): void {
    this.http.delete(`${BASE_API_URL}api/tasks/${id}`, { withCredentials: true }).subscribe(() => {
      const updatedTasks = this.#tasks().filter((t) => t.id !== id);
      this.#tasks.set(updatedTasks);
    });
  }

  getTask(id: number): Task | undefined {
    return this.#tasks().find((t) => t.id === id);
  }
}
