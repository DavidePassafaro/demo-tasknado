import {
  Component,
  input,
  Output,
  EventEmitter,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

interface EntityInput {
  name: string;
  description: string;
  color?: string;
}

const COLORS = [
  '#667eea', // Purple
  '#764ba2', // Dark Purple
  '#f093fb', // Pink
  '#4facfe', // Blue
  '#00f2fe', // Cyan
  '#43e97b', // Green
  '#fa709a', // Red
  '#fee140', // Yellow
];

@Component({
  selector: 'tn-create-entity',
  templateUrl: './create-entity.component.html',
  styleUrl: './create-entity.component.scss',
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateEntityComponent {
  entityName = input('');
  includeColors = input(false);

  @Output() entityCreated = new EventEmitter<EntityInput>();

  isExpanded = signal(false);

  name = signal('');
  description = signal('');
  color = signal(COLORS[0]);

  protected readonly colors = COLORS;

  /**
   * Toggles the expansion state of the create entity form
   */
  protected toggle(): void {
    this.isExpanded.update((val) => !val);
  }

  /**
   * Handles the creation of a new entity
   */
  protected create(): void {
    if (!this.name().trim()) {
      return;
    }

    this.entityCreated.emit({
      name: this.name(),
      description: this.description(),
      color: this.includeColors() ? this.color() : undefined,
    });

    // Reset form
    this.name.set('');
    this.description.set('');
    this.color.set(COLORS[0]);
    this.isExpanded.set(false);
  }

  /**
   * Closes the create entity form
   */
  protected close(): void {
    this.isExpanded.set(false);
  }
}
