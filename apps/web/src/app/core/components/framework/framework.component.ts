import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent, FooterSection, HeaderComponent, NavItem } from '@shared/ui';

@Component({
  selector: 'app-framework',
  templateUrl: './framework.component.html',
  styleUrl: './framework.component.scss',
  imports: [RouterModule, HeaderComponent, FooterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FrameworkComponent {
  protected readonly navItems: NavItem[] = [
    { label: 'Dashboard', link: '/dashboard' },
    { label: 'Projects', link: '/projects' },
  ];

  protected readonly footerSections: FooterSection[] = [
    {
      title: 'Company',
      links: [
        { label: 'About Us', link: '/about' },
        { label: 'Careers', link: '/careers' },
        { label: 'Press', link: '/press' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', link: '/help' },
        { label: 'Terms of Service', link: '/terms' },
        { label: 'Privacy Policy', link: '/privacy' },
      ],
    },
  ];
}
