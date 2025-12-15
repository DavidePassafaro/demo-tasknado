import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Task } from '@shared/models';
import { DeleteButtonComponent } from '@shared/ui';

@Component({
  selector: 'tn-task-card',
  templateUrl: './task-card.html',
  styleUrl: './task-card.scss',
  imports: [DatePipe, DeleteButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskCardComponent {
  task = input.required<Task>();
  taskDeleted = output<number>();
  taskToggled = output<number>();
  taskSelected = output<Task>();

  onTaskClick() {
    this.taskSelected.emit(this.task());
  }

  onDelete() {
    this.taskDeleted.emit(this.task().id);
  }

  onToggle(event: Event) {
    event.stopPropagation();
    this.taskToggled.emit(this.task().id);
  }
}
