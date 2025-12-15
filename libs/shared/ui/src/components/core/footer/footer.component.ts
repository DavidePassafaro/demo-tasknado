import { D } from '@angular/cdk/keycodes';
import { ChangeDetectionStrategy, Component, input, numberAttribute } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface FooterLink {
  label: string;
  link: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

@Component({
  selector: 'tn-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  sections = input<FooterSection[]>([]);
  legalYear = input(new Date().getFullYear(), { transform: numberAttribute });
  companyName = input<string>();
}
