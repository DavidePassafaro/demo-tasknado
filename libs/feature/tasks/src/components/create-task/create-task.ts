import { Component, output, signal } from '@angular/core';
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
})
export class CreateTaskComponent {
  taskCreated = output<TaskInput>();

  isExpanded = signal(false);
  taskTitle = '';
  taskDescription = '';

  toggleExpanded() {
    this.isExpanded.update(value => !value);
  }

  addTask() {
    if (this.taskTitle.trim()) {
      this.taskCreated.emit({
        title: this.taskTitle,
        description: this.taskDescription,
      });
      this.taskTitle = '';
      this.taskDescription = '';
    }
  }
}
