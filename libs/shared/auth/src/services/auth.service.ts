import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Injector, signal } from '@angular/core';
import { catchError, Observable, of, skip, switchMap, tap } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { User } from '@shared/models';

const BASE_API_URL = 'http://localhost:4000/';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly injector = inject(Injector);

  // Signal for current user
  currentUser = signal<User | null>(null);

  // Signal for loading state
  isLoading = signal(false);

  // Signal for error state
  error = signal<string | null>(null);

  constructor() {
    this.getCurrentUser();
  }

  /**
   * Fetch the current authenticated user from the backend
   */
  getCurrentUser(): void {
    this.isLoading.set(true);

    this.http
      .get<User>(`${BASE_API_URL}api/user/current`, { withCredentials: true })
      .pipe(
        tap((user) => {
          this.currentUser.set(user);
        }),
        catchError(() => {
          this.currentUser.set(null);
          return of(null);
        })
      )
      .subscribe(() => {
        this.isLoading.set(false);
      });
  }

  /**
   * Initiate Google authentication flow
   */
  loginWithGoogle(): void {
    window.location.href = `${BASE_API_URL}auth/google`;
  }

  /**
   * Get an observable of the current user, waiting for loading to complete if necessary
   */
  getCurrentUser$(): Observable<User | null> {
    return toObservable(this.isLoading, { injector: this.injector }).pipe(
      switchMap((isLoading) =>
        isLoading
          ? toObservable(this.currentUser, { injector: this.injector }).pipe(skip(1))
          : of(this.currentUser())
      )
    );
  }
}
