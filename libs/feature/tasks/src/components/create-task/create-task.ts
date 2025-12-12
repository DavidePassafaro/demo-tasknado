import { Component, input, output, signal, effect, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface TaskInput {
  title: string;
  description: string;
}

@Component({
  selector: 'tn-create-task',
  templateUrl: './create-task.html',
  styleUrl: './create-task.scss',
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateTaskComponent {
  // Inputs
  initialTitle = input('');
  initialDescription = input('');
  isEditMode = input(false);

  // Outputs
  taskCreated = output<TaskInput>();
  taskSaved = output<TaskInput>();
  taskEditCancelled = output<void>();

  isExpanded = signal(false);
  taskTitle = signal('');
  taskDescription = signal('');

  constructor() {
    // Effetto per aggiornare i campi quando gli input cambiano
    effect(() => {
      const title = this.initialTitle();
      const description = this.initialDescription();
      const editMode = this.isEditMode();
      
      if (editMode) {
        this.taskTitle.set(title);
        this.taskDescription.set(description);
        this.isExpanded.set(true);
      } else {
        this.taskTitle.set('');
        this.taskDescription.set('');
        this.isExpanded.set(false);
      }
    });
  }

  toggleExpanded() {
    this.isExpanded.update(value => !value);
  }

  addTask() {
    const title = this.taskTitle().trim();
    if (!title) {
      alert('Title cannot be empty');
      return;
    }

    const taskInput: TaskInput = {
      title,
      description: this.taskDescription(),
    };

    if (this.isEditMode()) {
      this.taskSaved.emit(taskInput);
    } else {
      this.taskCreated.emit(taskInput);
      this.taskTitle.set('');
      this.taskDescription.set('');
    }
  }

  cancel() {
    if (this.isEditMode()) {
      this.taskEditCancelled.emit();
    } else {
      this.isExpanded.set(false);
      this.taskTitle.set(this.initialTitle());
      this.taskDescription.set(this.initialDescription());
    }
  }
}
