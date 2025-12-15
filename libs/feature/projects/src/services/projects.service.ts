import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Project } from '@shared/models';
import { Observable, tap } from 'rxjs';
import { BASE_API_URL } from '@shared/models';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private readonly apiUrl = inject(BASE_API_URL);
  private readonly http = inject(HttpClient);

  #projects = signal<Project[]>([]);
  projects = this.#projects.asReadonly();

  /**
   * Fetches all projects from the backend
   * @return An array of projects
   */
  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}api/projects`, { withCredentials: true }).pipe(
      tap((response) => {
        this.#projects.set(response);
      })
    );
  }

  /**
   * Adds a new project to the backend
   * @param project The partial project data to add
   */
  addProject(project: Partial<Project>): void {
    this.http
      .post<Project>(`${this.apiUrl}api/projects`, project, { withCredentials: true })
      .subscribe((response) => {
        this.#projects.set([...this.#projects(), response]);
      });
  }

  /**
   * Fetches a project by its ID from the backend
   * @param id The ID of the project
   * @return The project with the specified ID
   */
  getProjectById(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}api/projects/${id}`, { withCredentials: true });
  }

  /**
   * Updates an existing project in the backend
   * @param id The ID of the project to update
   * @param updates The partial project data to update
   */
  updateProject(id: number, updates: Partial<Project>): void {
    this.http
      .put<Project>(`${this.apiUrl}api/projects/${id}`, updates, { withCredentials: true })
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
    this.http
      .delete(`${this.apiUrl}api/projects/${id}`, { withCredentials: true })
      .subscribe(() => {
        const updatedProjects = this.#projects().filter((p) => p.id !== id);
        this.#projects.set(updatedProjects);
      });
  }
}
