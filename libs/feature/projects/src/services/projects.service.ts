import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Project } from '@shared/models';

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

  addProject(project: Partial<Project>) {
    this.http
      .post<Project>(`${BASE_API_URL}api/projects`, project, { withCredentials: true })
      .subscribe((response) => {
        this.projects.set([...this.projects(), response]);
      });
  }

  getProject(id: number): Project | null {
    return this.projects().find((p) => p.id === id) || null;
  }

  updateProject(id: number, updates: Partial<Project>) {
    const projects = this.projects();
    const index = projects.findIndex((p) => p.id === id);
    if (index !== -1) {
      projects[index] = { ...projects[index], ...updates };
      this.projects.set([...projects]);
    }
  }

  deleteProject(id: number) {
    this.projects.set(this.projects().filter((p) => p.id !== id));
  }
}
