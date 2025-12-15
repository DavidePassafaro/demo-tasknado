import { Component, input, output, signal, effect, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface TaskInput {
  title: string;
  description: string;
}

@Component({
  selector: 'tn-create-task',
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.scss',
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateTaskComponent {
  initialTitle = input('');
  initialDescription = input('');
  isEditMode = input(false);

  taskCreated = output<TaskInput>();
  taskSaved = output<TaskInput>();
  taskEditCancelled = output<void>();

  protected isExpanded = signal(false);
  protected taskTitle = signal('');
  protected taskDescription = signal('');

  constructor() {
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

  /**
   * Toggles the expanded state of the create task form
   */
  protected toggleExpanded(): void {
    this.isExpanded.update((value) => !value);
  }

  /**
   * Adds a new task or saves the edited task
   */
  protected addTask(): void {
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
      this.isExpanded.set(false);
    }
  }

  /**
   * Cancels the task creation or editing
   */
  protected cancel(): void {
    if (this.isEditMode()) {
      this.taskEditCancelled.emit();
    } else {
      this.isExpanded.set(false);
      this.taskTitle.set(this.initialTitle());
      this.taskDescription.set(this.initialDescription());
    }
  }
}
