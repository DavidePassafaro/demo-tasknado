import { ChangeDetectionStrategy, Component, input, OnInit, signal, inject, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NavItem } from './header.model';

const THEME_KEY = 'tn-theme';

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

  private renderer = inject(Renderer2);
  private document = inject(DOCUMENT);

  ngOnInit() {
    // Load theme from localStorage or default to light
    const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
    this.renderer.setAttribute(this.document.body, 'data-theme', savedTheme);
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
    const currentTheme = this.document.body.getAttribute('data-theme');
    const isDark = currentTheme === 'dark';
    const newTheme = isDark ? 'light' : 'dark';

    // Update DOM using Renderer2
    this.renderer.setAttribute(this.document.body, 'data-theme', newTheme);

    // Save to localStorage
    localStorage.setItem(THEME_KEY, newTheme);
  }
}
