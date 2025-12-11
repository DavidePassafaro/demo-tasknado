import { ChangeDetectionStrategy, Component, input } from '@angular/core';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  sections = input<FooterSection[]>([]);
  companyName = input<string>();
  isDarkMode = input<boolean>(true);
}
