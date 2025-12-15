import { Component, input, output, signal, effect, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface EntityInput {
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
  selector: 'tn-edit-entity',
  templateUrl: './edit-entity.component.html',
  styleUrl: './edit-entity.component.scss',
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditEntityComponent {
  entity = input.required<EntityInput>();
  entityName = input('');
  includeColors = input(false);

  entityUpdated = output<EntityInput>();
  closed = output<void>();

  name = signal('');
  description = signal('');
  color = signal(COLORS[0]);
  isExpanded = signal(true);

  protected readonly colors = COLORS;

  constructor() {
    effect(() => {
      if (this.entity()) {
        this.name.set(this.entity().name || '');
        this.description.set(this.entity().description || '');
        this.color.set(this.entity().color || this.colors[0]);
      }
    });
  }

  /**
   * Handles the update of the entity
   */
  protected update(): void {
    if (!this.name().trim()) {
      return;
    }

    this.entityUpdated.emit({
      name: this.name(),
      description: this.description(),
      color: this.includeColors() ? this.color() : undefined,
    });
  }

  /**
   * Closes the edit entity form
   */
  protected close(): void {
    this.isExpanded.set(false);
    this.closed.emit();
  }
}
