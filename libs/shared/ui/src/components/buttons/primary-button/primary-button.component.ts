import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'button[tn-primary-button], a[tn-primary-button]',
  templateUrl: './primary-button.component.html',
  styleUrl: './primary-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrimaryButtonComponent {
  disabled = input<boolean>(false);
  type = input<'button' | 'submit' | 'reset'>('button');

  clicked = output<void>();

  onButtonClick() {
    this.clicked.emit();
  }
}
