import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Task } from '@shared/models';
import { Observable, tap } from 'rxjs';
import { BASE_API_URL } from '@shared/models';

@Injectable({ providedIn: 'root' })
export class TasksService {
  private readonly apiUrl = inject(BASE_API_URL);
  private readonly http = inject(HttpClient);

  #tasks = signal<Task[]>([]);
  tasks = this.#tasks.asReadonly();

  /**
   * Fetches tasks for a specific project from the backend
   * @param projectId The ID of the project
   * @returns An array of tasks for the specified project
   */
  getTasks(projectId: number): Observable<Task[]> {
    return this.http
      .get<Task[]>(`${this.apiUrl}api/tasks/project/${projectId}`, { withCredentials: true })
      .pipe(
        tap((response) => {
          this.#tasks.set(response);
        })
      );
  }

  /**
   * Adds a new task to the backend
   * @param task The partial task data to add
   */
  addTask(task: Partial<Task>): void {
    this.http
      .post<Task>(`${this.apiUrl}api/tasks`, task, { withCredentials: true })
      .subscribe((response) => {
        this.#tasks.set([...this.#tasks(), response]);
      });
  }

  /**
   * Fetches a task by its ID from the backend
   * @param id The ID of the task
   */
  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}api/tasks/${id}`, { withCredentials: true });
  }

  /**
   * Fetches tasks associated with a specific project ID
   * @param projectId The ID of the project
   * @returns An array of tasks for the specified project
   */
  getTasksByProjectId(projectId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}api/projects/${projectId}/tasks`, {
      withCredentials: true,
    });
  }

  /**
   * Updates an existing task in the backend
   * @param id The ID of the task to update
   * @param updates The partial task data to update
   */
  updateTask(id: number, updates: Partial<Task>): void {
    this.http
      .put<Task>(`${this.apiUrl}api/tasks/${id}`, updates, { withCredentials: true })
      .subscribe((updatedTask) => {
        const updatedTasks = this.#tasks().map((task) => (task.id === id ? updatedTask : task));
        this.#tasks.set(updatedTasks);
      });
  }

  /**
   * Deletes a task from the backend
   * @param id The ID of the task to delete
   */
  deleteTask(id: number): void {
    this.http.delete(`${this.apiUrl}api/tasks/${id}`, { withCredentials: true }).subscribe(() => {
      const updatedTasks = this.#tasks().filter((t) => t.id !== id);
      this.#tasks.set(updatedTasks);
    });
  }

  /**
   * Retrieves a task from the local signal by its ID
   * @param id The ID of the task
   * @returns The task with the specified ID, or undefined if not found
   */
  getTask(id: number): Task | undefined {
    return this.#tasks().find((t) => t.id === id);
  }
}
