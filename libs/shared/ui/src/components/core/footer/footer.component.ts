import { ChangeDetectionStrategy, Component, input } from '@angular/core';
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
  companyName = input<string>();
}
