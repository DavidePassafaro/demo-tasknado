import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { Router } from '@angular/router';
import { CreateEntityComponent } from '../../components/create-entity/create-entity.component';
import { ProjectCardComponent } from '@shared/ui';
import { ProjectsFacade } from '@shared/state-management';
import { Project } from '@shared/models';
import { EntityInput } from '../../components/edit-entity/edit-entity.component';

@Component({
  selector: 'tn-projects',
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
  imports: [CreateEntityComponent, ProjectCardComponent, ScrollingModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Projects {
  private router = inject(Router);
  private projectsFacade = inject(ProjectsFacade);

  projects = this.projectsFacade.projects;
  loading = this.projectsFacade.loading;
  error = this.projectsFacade.error;

  /**
   * Handles the creation of a new project
   * @param projectInput The input data for the new project
   */
  protected onProjectCreated(projectInput: EntityInput): void {
    this.projectsFacade.createProject(projectInput);
  }

  /**
   * Deletes a project by its ID
   * @param id The ID of the project to delete
   */
  protected deleteProject(id: number): void {
    this.projectsFacade.deleteProject(id);
  }

  /**
   * Navigates to the selected project's detail page
   * @param project The selected project
   */
  protected onProjectSelected(project: Project): void {
    this.router.navigate(['/projects/', project.id]);
  }

  /**
   * Track by function for virtual scroll optimization
   * @param index The index of the project
   * @param project The project object
   * @returns The project ID for tracking
   */
  protected trackByProjectId(index: number, project: Project): number {
    return project.id;
  }
}
