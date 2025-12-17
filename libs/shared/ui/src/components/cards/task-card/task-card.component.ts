import { Component, input, output, ChangeDetectionStrategy, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Task } from '@shared/models';
import { DeleteButtonComponent } from '../../buttons/delete-button/delete-button.component';

@Component({
  selector: 'tn-task-card',
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
  imports: [DatePipe, DeleteButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskCardComponent {
  task = input.required<Task>();

  taskDeleted = output<number>();
  taskToggled = output<number>();
  taskSelected = output<Task>();

  protected isTaskStatusCompleted = computed(() => this.task().status === 'completed');

  /**
   * Handles the click event on the task card
   */
  protected onTaskClick(): void {
    this.taskSelected.emit(this.task());
  }

  /**
   * Handles the deletion of the task
   */
  protected onDelete(): void {
    this.taskDeleted.emit(this.task().id);
  }

  /**
   * Handles the toggling of the task's completion status
   */
  protected onToggle(event: Event): void {
    event.stopPropagation();
    this.taskToggled.emit(this.task().id);
  }
}
