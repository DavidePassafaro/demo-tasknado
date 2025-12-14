import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
