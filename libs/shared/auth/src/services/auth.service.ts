import { Injectable, signal } from '@angular/core';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly authApiUrl = 'http://localhost:4000/auth/google';

  // Signal for current user
  currentUser = signal<AuthUser | null>(null);

  // Signal for loading state
  isLoading = signal(false);

  // Signal for error state
  error = signal<string | null>(null);

  constructor() {}

  /**
   * Initiate Google authentication flow
   */
  loginWithGoogle(): void {
    // Cambia l'Observable in void
    this.isLoading.set(true);
    this.error.set(null);

    window.location.href = this.authApiUrl;
  }
}
