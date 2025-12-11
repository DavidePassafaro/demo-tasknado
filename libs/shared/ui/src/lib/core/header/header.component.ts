import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

export interface NavItem {
  label: string;
  link: string;
}

@Component({
  selector: 'tn-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  navItems = input<NavItem[]>([]);
  logoText = input<string>('Logo');
  logoImage = input<string>('');

  isMenuOpen = signal(false);
  isDarkMode = signal(true);

  toggleMenu() {
    this.isMenuOpen.update((value) => !value);
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }

  toggleTheme() {
    this.isDarkMode.update((value) => !value);
  }
}
