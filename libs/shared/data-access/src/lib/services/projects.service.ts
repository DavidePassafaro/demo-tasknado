import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Project, Task } from '@shared/models';
import { forkJoin, map, Observable, switchMap, tap, of } from 'rxjs';
import { BASE_API_URL } from '@shared/models';
import { TasksService } from './tasks.service';

@Injectable({ providedIn: 'root' })
export class ProjectsService {
  private readonly apiUrl = inject(BASE_API_URL);
  private readonly http = inject(HttpClient);
  private readonly tasksService = inject(TasksService);

  #projects = signal<Project[]>([]);
  projects = this.#projects.asReadonly();

  /**
   * Fetches all projects from the backend
   * @return An array of projects
   */
  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}api/projects`).pipe(
      switchMap((projects) =>
        forkJoin<Project[]>(
          projects.map((project) =>
            this.tasksService
              .getTasksByProjectId(project.id)
              .pipe(map((tasks) => ({ ...project, tasks } as Project)))
          )
        )
      ),
      tap((response) => this.#projects.set(response))
    );
  }

  /**
   * Adds a new project to the backend
   * @param project The partial project data to add
   */
  addProject(project: Partial<Project>): void {
    this.http.post<Project>(`${this.apiUrl}api/projects`, project).subscribe((response) => {
      this.#projects.set([...this.#projects(), response]);
    });
  }

  /**
   * Fetches a project by its ID from the backend
   * @param id The ID of the project
   * @return The project with the specified ID
   */
  getProjectById(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}api/projects/${id}`);
  }

  /**
   * Updates an existing project in the backend
   * @param id The ID of the project to update
   * @param updates The partial project data to update
   */
  updateProject(id: number, updates: Partial<Project>): void {
    this.http
      .put<Project>(`${this.apiUrl}api/projects/${id}`, updates)
      .subscribe((updatedProject) => {
        const updatedProjects = this.#projects().map((project) =>
          project.id === id ? updatedProject : project
        );
        this.#projects.set(updatedProjects);
      });
  }

  /**
   * Deletes a project from the backend
   * @param id The ID of the project to delete
   */
  deleteProject(id: number): void {
    this.http.delete(`${this.apiUrl}api/projects/${id}`).subscribe(() => {
      const updatedProjects = this.#projects().filter((p) => p.id !== id);
      this.#projects.set(updatedProjects);
    });
  }

  /**
   * Fetches all tasks across all projects
   * @returns An array of tasks
   */
  getProjectsTasks(): Observable<Task[]> {
    return this.getProjects().pipe(
      switchMap((projects) => {
        if (projects.length === 0) {
          // Return empty array if no projects
          return of([]);
        }

        // Get tasks from all projects
        const taskObservables = projects.map((project) =>
          this.tasksService.getTasksByProjectId(project.id)
        );

        // Combine all task arrays into a single array
        return forkJoin(taskObservables).pipe(switchMap((taskArrays) => of(taskArrays.flat())));
      })
    );
  }
}
