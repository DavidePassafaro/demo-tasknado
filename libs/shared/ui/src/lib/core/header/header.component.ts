import { ChangeDetectionStrategy, Component, input, OnInit, signal } from '@angular/core';

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
export class HeaderComponent implements OnInit {
  navItems = input<NavItem[]>([]);
  logoText = input<string>('Logo');
  logoImage = input<string>('');

  isMenuOpen = signal(false);

  ngOnInit() {
    document.body.setAttribute('data-theme', 'light');
  }

  toggleMenu() {
    this.isMenuOpen.update((value) => !value);
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }

  toggleTheme() {
    const body = document.body;
    const isDark = body.getAttribute('data-theme') === 'dark';
    if (isDark) {
      body.setAttribute('data-theme', 'light');
    } else {
      body.setAttribute('data-theme', 'dark');
    }
  }
}
