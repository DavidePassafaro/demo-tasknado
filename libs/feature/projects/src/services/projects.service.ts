import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Project } from '@shared/models';
import { Observable } from 'rxjs';

const BASE_API_URL = 'http://localhost:4000/';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private readonly http = inject(HttpClient);

  projects = signal<Project[]>([]);

  constructor() {
    this.getProjects();
  }

  getProjects(): void {
    this.http
      .get<Project[]>(`${BASE_API_URL}api/projects`, { withCredentials: true })
      .subscribe((response) => {
        this.projects.set(response);
      });
  }

  addProject(project: Partial<Project>): void {
    this.http
      .post<Project>(`${BASE_API_URL}api/projects`, project, { withCredentials: true })
      .subscribe((response) => {
        this.projects.set([...this.projects(), response]);
      });
  }

  getProjectById(id: number): Observable<Project> {
    return this.http.get<Project>(`${BASE_API_URL}api/projects/${id}`, { withCredentials: true });
  }

  updateProject(id: number, updates: Partial<Project>) {
    this.http
      .put<Project>(`${BASE_API_URL}api/projects/${id}`, updates, { withCredentials: true })
      .subscribe((updatedProject) => {
        const updatedProjects = this.projects().map((project) =>
          project.id === id ? updatedProject : project
        );
        this.projects.set(updatedProjects);
      });
  }

  deleteProject(id: number): void {
    this.http
      .delete(`${BASE_API_URL}api/projects/${id}`, { withCredentials: true })
      .subscribe(() => {
        const updatedProjects = this.projects().filter((p) => p.id !== id);
        this.projects.set(updatedProjects);
      });
  }
}
