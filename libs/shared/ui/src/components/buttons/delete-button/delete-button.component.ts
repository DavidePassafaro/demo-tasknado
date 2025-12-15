import { Component, output, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'tn-delete-button',
  templateUrl: './delete-button.component.html',
  styleUrl: './delete-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteButtonComponent {
  deleted = output<void>();

  /*
   * Prevent event propagation to parent elements when the delete button is clicked.
   */
  protected onDelete(event: Event): void {
    event.stopPropagation();
    this.deleted.emit();
  }
}
