import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Project } from '@shared/models';
import { DeleteButtonComponent } from '../../buttons/delete-button/delete-button.component';

@Component({
  selector: 'tn-project-card',
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss',
  imports: [DeleteButtonComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCardComponent {
  project = input.required<Project>();

  projectDeleted = output<number>();
  projectSelected = output<Project>();

  /**
   * Emits the selected project when the card is clicked
   */
  protected onProjectClick(): void {
    this.projectSelected.emit(this.project());
  }

  /**
   * Emits the project ID when the delete button is clicked
   */
  protected onDelete(): void {
    this.projectDeleted.emit(this.project().id);
  }
}
