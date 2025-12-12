import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';

export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
}

@Component({
  selector: 'tn-task-card',
  templateUrl: './task-card.html',
  styleUrl: './task-card.scss',
  imports: [DatePipe],
})
export class TaskCardComponent {
  task = input.required<Task>();
  taskDeleted = output<number>();
  taskToggled = output<number>();

  onDelete() {
    this.taskDeleted.emit(this.task().id);
  }

  onToggle() {
    this.taskToggled.emit(this.task().id);
  }
}
