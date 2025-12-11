import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'tn-primary-card',
  templateUrl: './primary-card.component.html',
  styleUrl: './primary-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrimaryCardComponent {
  icon = input<string>('');
  title = input<string>('');
  description = input<string>('');
}
