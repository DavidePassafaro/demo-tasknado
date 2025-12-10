import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UiComponent } from '@shared/ui';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [RouterModule, UiComponent],
})
export class App {
  protected title = 'web';
}
