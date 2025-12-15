import { ChangeDetectionStrategy, Component, input, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NavItem } from './header.model';

@Component({
  selector: 'tn-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  navItems = input<NavItem[]>([]);
  logoText = input<string>('Logo');
  logoImage = input<string>('');

  isMenuOpen = signal(false);

  ngOnInit() {
    document.body.setAttribute('data-theme', 'light');
  }

  /**
   * Toggles the navigation menu open/closed
   */
  protected toggleMenu(): void {
    this.isMenuOpen.update((value) => !value);
  }

  /**
   * Closes the navigation menu
   */
  protected closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  /**
   * Toggles between light and dark themes
   */
  protected toggleTheme(): void {
    const body = document.body;
    const isDark = body.getAttribute('data-theme') === 'dark';

    if (isDark) {
      body.setAttribute('data-theme', 'light');
    } else {
      body.setAttribute('data-theme', 'dark');
    }
  }
}
