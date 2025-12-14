import { Component, input, output, signal, effect, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface ProjectInput {
  name: string;
  description: string;
  color?: string;
}

@Component({
  selector: 'tn-create-project',
  templateUrl: './create-project.html',
  styleUrl: './create-project.scss',
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateProjectComponent {
  // Color palette
  availableColors = ['#3b82f6', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];

  // Inputs
  initialName = input('');
  initialDescription = input('');
  isEditMode = input(false);

  // Outputs
  projectCreated = output<ProjectInput>();
  projectSaved = output<ProjectInput>();
  projectEditCancelled = output<void>();

  isExpanded = signal(false);
  projectName = signal('');
  projectDescription = signal('');
  selectedColor = signal(this.availableColors[0]);

  constructor() {
    // Effetto per aggiornare i campi quando gli input cambiano
    effect(() => {
      const name = this.initialName();
      const description = this.initialDescription();
      const editMode = this.isEditMode();

      if (editMode) {
        this.projectName.set(name);
        this.projectDescription.set(description);
        this.isExpanded.set(true);
      } else {
        this.projectName.set('');
        this.projectDescription.set('');
        this.isExpanded.set(false);
      }
    });
  }

  toggleExpanded() {
    this.isExpanded.update((value) => !value);
  }

  addProject() {
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
    }
  }

  cancel() {
    if (this.isEditMode()) {
      this.projectEditCancelled.emit();
    } else {
      this.isExpanded.set(false);
      this.projectName.set(this.initialName());
      this.projectDescription.set(this.initialDescription());
    }
  }
}
