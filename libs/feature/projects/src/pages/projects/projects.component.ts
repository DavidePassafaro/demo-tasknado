import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { Router } from '@angular/router';
import { CreateProjectComponent } from '../../components/create-project/create-project.component';
import { ProjectCardComponent } from '../../components/project-card/project-card.component';
import { ProjectsService } from '../../services/projects.service';
import { Project } from '@shared/models';

interface ProjectInput {
  name: string;
  description: string;
  color?: string;
}

@Component({
  selector: 'tn-projects',
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
  imports: [CreateProjectComponent, ProjectCardComponent, ScrollingModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Projects {
  private router = inject(Router);
  private projectsService = inject(ProjectsService);

  projects = computed(() => this.projectsService.projects());
  nextId = 1;

  /**
   * Handles the creation of a new project
   * @param projectInput The input data for the new project
   */
  protected onProjectCreated(projectInput: ProjectInput): void {
    const newProject: Partial<Project> = {
      name: projectInput.name,
      description: projectInput.description,
      color: projectInput.color,
    };
    this.projectsService.addProject(newProject);
  }

  /**
   * Deletes a project by its ID
   * @param id The ID of the project to delete
   */
  protected deleteProject(id: number): void {
    this.projectsService.deleteProject(id);
  }

  /**
   * Navigates to the selected project's detail page
   * @param project The selected project
   */
  protected onProjectSelected(project: Project): void {
    this.router.navigate(['/projects/', project.id]);
  }
}
