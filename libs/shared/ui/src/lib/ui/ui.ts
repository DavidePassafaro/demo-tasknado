import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'tn-ui',
  templateUrl: './ui.html',
  styleUrl: './ui.scss',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiComponent {}
