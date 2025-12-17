import { Component, inject, computed, signal, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe, CommonModule } from '@angular/common';
import { EditEntityComponent } from '../../components/edit-entity/edit-entity.component';
import { Project } from '@shared/models';
import { ProjectsService } from '@shared/data-access';

interface ProjectInput {
  name: string;
  description: string;
  color?: string;
}

@Component({
  selector: 'tn-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss',
  imports: [DatePipe, CommonModule, EditEntityComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDetailComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private projectsService = inject(ProjectsService);

  protected projectId = signal<number>(0);
  protected isEditMode = signal(false);

  protected project = computed(() => this.getProject());

  constructor() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const projectId = parseInt(idParam, 10);
      if (!isNaN(projectId)) this.projectId.set(projectId);
    }
  }

  /**
   * Navigates back to the projects list
   */
  protected goBack(): void {
    this.router.navigate(['/projects']);
  }

  /**
   * Enters edit mode for the project
   */
  protected startEdit(): void {
    this.isEditMode.set(true);
  }

  /**
   * Saves the edited project details
   * @param projectInput The edited project details
   */
  protected saveEdit(projectInput: ProjectInput): void {
    const currentProject = this.project();
    if (currentProject) {
      this.projectsService.updateProject(currentProject.id, {
        name: projectInput.name,
        description: projectInput.description,
        color: projectInput.color,
      });
      this.isEditMode.set(false);
    }
  }

  /**
   * Cancels the edit mode without saving changes
   */
  protected cancelEdit(): void {
    this.isEditMode.set(false);
  }

  /**
   * Deletes the current project after confirmation and navigates back to the projects list
   */
  protected deleteProject(): void {
    const currentProject = this.project();
    if (currentProject && confirm('Are you sure you want to delete this project?')) {
      this.projectsService.deleteProject(currentProject.id);
      this.router.navigate(['/projects']);
    }
  }

  /**
   * Retrieves the current project based on the projectId signal
   * @returns The current project or null if not found
   */
  private getProject(): Project | null {
    const id = this.projectId();
    if (!id) return null;
    const project = this.projectsService.projects().find((p) => p.id === id);
    return project || null;
  }
}
