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
   * Fetches all tasks from the backend
   * @returns Observable of all tasks
   */
  getTasks(): Observable<Task[]> {
    return this.http
      .get<Task[]>(`${this.apiUrl}api/tasks`)
      .pipe(tap((response) => this.#tasks.set(response)));
  }

  /**
   * Fetches a task by its ID from the backend
   * @param id The ID of the task
   */
  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}api/tasks/${id}`);
  }

  /**
   * Fetches tasks associated with a specific project ID
   * @param projectId The ID of the project
   * @returns An array of tasks for the specified project
   */
  getTasksByProjectId(projectId: number): Observable<Task[]> {
    return this.http
      .get<Task[]>(`${this.apiUrl}api/tasks/project/${projectId}`)
      .pipe(tap((response) => this.#tasks.set(response)));
  }

  /**
   * Creates a new task via Observable
   * @param task The partial task data to create
   * @returns Observable of the created task
   */
  addTask(task: Partial<Task>): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}api/tasks`, task).pipe(
      tap((response) => {
        this.#tasks.set([...this.#tasks(), response]);
      })
    );
  }

  /**
   * Updates an existing task in the backend
   * @param id The ID of the task to update
   * @param updates The partial task data to update
   * @returns The observable of request to update the task
   */
  updateTask(id: number, updates: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}api/tasks/${id}`, updates).pipe(
      tap((updatedTask) => {
        const updatedTasks = this.#tasks().map((task) => (task.id === id ? updatedTask : task));
        this.#tasks.set(updatedTasks);
      })
    );
  }

  /**
   * Deletes a task from the backend
   * @param id The ID of the task to delete
   * @returns Observable of the delete operation
   */
  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}api/tasks/${id}`).pipe(
      tap(() => {
        const updatedTasks = this.#tasks().filter((t) => t.id !== id);
        this.#tasks.set(updatedTasks);
      })
    );
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
