import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PrimaryButtonComponent } from '@shared/ui';

@Component({
  selector: 'tn-not-found',
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss',
  imports: [RouterModule, PrimaryButtonComponent],
})
export class NotFoundPage {}
