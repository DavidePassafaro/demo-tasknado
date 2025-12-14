import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';

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

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  /**
   * Initiate Google authentication flow
   */
  loginWithGoogle(): Observable<{ url: string }> {
    this.isLoading.set(true);
    this.error.set(null);

    return this.http.get<{ url: string }>(this.authApiUrl, {}).pipe(
      map((response) => {
        // Redirect to Google OAuth URL
        if (response.url) {
          window.location.href = response.url;
        }
        return response;
      }),
      catchError((err) => {
        this.isLoading.set(false);
        const errorMessage = err?.error?.message || 'Authentication failed';
        this.error.set(errorMessage);
        throw err;
      })
    );
  }

  /**
   * Set the current user after successful authentication
   */
  setUser(user: AuthUser): void {
    this.currentUser.set(user);
    localStorage.setItem('authUser', JSON.stringify(user));
    this.isLoading.set(false);
  }

  /**
   * Logout the current user
   */
  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem('authUser');
    this.error.set(null);
  }

  /**
   * Load user from localStorage if available
   */
  private loadUserFromStorage(): void {
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser) as AuthUser;
        this.currentUser.set(user);
      } catch {
        localStorage.removeItem('authUser');
      }
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }
}
