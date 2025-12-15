import { Component, output, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'tn-delete-button',
  templateUrl: './delete-button.html',
  styleUrl: './delete-button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteButtonComponent {
  deleted = output<void>();

  onDelete(event: Event) {
    event.stopPropagation();
    this.deleted.emit();
  }
}
