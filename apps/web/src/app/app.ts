import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent, HeaderComponent } from '@shared/ui';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [RouterModule, HeaderComponent, FooterComponent],
})
export class App {
  protected readonly navItems = [
    { label: 'Home', link: '/' },
    { label: 'Tasks', link: '/tasks' }
  ];

  protected readonly footerSections = [
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
