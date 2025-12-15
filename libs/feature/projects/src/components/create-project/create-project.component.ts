import { Component, input, output, signal, effect, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface ProjectInput {
  name: string;
  description: string;
  color?: string;
}

const AVAILABLE_COLORS = [
  '#3b82f6',
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#FFA07A',
  '#98D8C8',
  '#F7DC6F',
];

@Component({
  selector: 'tn-create-project',
  templateUrl: './create-project.component.html',
  styleUrl: './create-project.component.scss',
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateProjectComponent {
  initialName = input('');
  initialDescription = input('');
  initialColor = input('');
  isEditMode = input(false);

  projectCreated = output<ProjectInput>();
  projectSaved = output<ProjectInput>();
  projectEditCancelled = output<void>();

  isExpanded = signal(false);
  projectName = signal('');
  projectDescription = signal('');
  selectedColor = signal(AVAILABLE_COLORS[0]);

  protected AVAILABLE_COLORS = AVAILABLE_COLORS;

  constructor() {
    effect(() => {
      const name = this.initialName();
      const description = this.initialDescription();
      const color = this.initialColor();
      const editMode = this.isEditMode();

      if (editMode) {
        this.projectName.set(name);
        this.projectDescription.set(description);
        this.selectedColor.set(color || AVAILABLE_COLORS[0]);
        this.isExpanded.set(true);
      } else {
        this.projectName.set('');
        this.projectDescription.set('');
        this.selectedColor.set(AVAILABLE_COLORS[0]);
        this.isExpanded.set(false);
      }
    });
  }

  /**
   * Toggles the expanded state of the project creation form.
   */
  protected toggleExpanded(): void {
    this.isExpanded.update((value) => !value);
  }

  /**
   * Handles the addition of a new project or saving of an existing project.
   */
  protected addProject(): void {
    const name = this.projectName().trim();
    if (!name) {
      alert('Project name cannot be empty');
      return;
    }

    const projectInput: ProjectInput = {
      name,
      description: this.projectDescription(),
      color: this.selectedColor(),
    };

    if (this.isEditMode()) {
      this.projectSaved.emit(projectInput);
    } else {
      this.projectCreated.emit(projectInput);
      this.projectName.set('');
      this.projectDescription.set('');
      this.isExpanded.set(false);
    }
  }

  /**
   * Handles the cancellation of project creation or editing.
   */
  protected cancel(): void {
    if (this.isEditMode()) {
      this.projectEditCancelled.emit();
    } else {
      this.isExpanded.set(false);
      this.projectName.set(this.initialName());
      this.projectDescription.set(this.initialDescription());
    }
  }
}
