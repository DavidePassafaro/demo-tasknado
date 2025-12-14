import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { Router } from '@angular/router';
import { CreateProjectComponent } from '../../components/create-project/create-project';
import { ProjectCardComponent } from '../../components/project-card/project-card';
import { ProjectsService } from '../../services/projects.service';
import { Project } from '@shared/models';

interface ProjectInput {
  name: string;
  description: string;
  color?: string;
}

@Component({
  selector: 'tn-projects',
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
  imports: [CreateProjectComponent, ProjectCardComponent, ScrollingModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Projects {
  private router = inject(Router);
  private projectsService = inject(ProjectsService);

  projects = computed(() => this.projectsService.projects());
  nextId = 1;

  onProjectCreated(projectInput: ProjectInput) {
    const newProject: Partial<Project> = {
      name: projectInput.name,
      description: projectInput.description,
      color: projectInput.color,
    };
    this.projectsService.addProject(newProject);
  }

  deleteProject(id: number) {
    this.projectsService.deleteProject(id);
  }

  onProjectSelected(project: Project) {
    this.router.navigate(['/projects/', project.id]);
  }
}
