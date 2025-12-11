import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'tn-benefit-card',
  templateUrl: './benefit-card.component.html',
  styleUrl: './benefit-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BenefitCardComponent {
  number = input<string>('');
  label = input<string>('');
}
