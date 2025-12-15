import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { Project } from '@shared/models';
import { DeleteButtonComponent } from '@shared/ui';

@Component({
  selector: 'tn-project-card',
  templateUrl: './project-card.html',
  styleUrl: './project-card.scss',
  imports: [DeleteButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCardComponent {
  project = input.required<Project>();
  projectDeleted = output<number>();
  projectSelected = output<Project>();

  onProjectClick() {
    this.projectSelected.emit(this.project());
  }

  onDelete() {
    this.projectDeleted.emit(this.project().id);
  }
}
