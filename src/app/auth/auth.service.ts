import { Injectable, signal } from '@angular/core';
import { Observable, of, throwError, tap, delay } from 'rxjs';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterData extends LoginCredentials {
  firstName: string;
  lastName: string;
  confirmPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_data';
  private readonly USERS_KEY = 'fake_users';

  private currentUser = signal<User | null>(null);

  constructor() {
    this.loadStoredUser();
  }

  login(credentials: LoginCredentials): Observable<any> {
    const users: User[] = JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
    const user = users.find(u => u.email === credentials.email && u.password === credentials.password);
    if (user) {
      const token = Math.random().toString(36).substring(2);
      if (credentials.rememberMe) {
        localStorage.setItem(this.TOKEN_KEY, token);
      } else {
        sessionStorage.setItem(this.TOKEN_KEY, token);
      }
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      this.currentUser.set(user);
      return of({ token }).pipe(delay(500));
    } else {
      return throwError(() => new Error('Email sau parolă incorecte!')).pipe(delay(500));
    }
  }

  register(data: RegisterData): Observable<any> {
    const users: User[] = JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
    if (users.find(u => u.email === data.email)) {
      return throwError(() => new Error('Emailul este deja folosit!')).pipe(delay(500));
    }
    const newUser: User = {
      id: Date.now(),
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      password: data.password
    };
    users.push(newUser);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    return of({ success: true }).pipe(delay(500));
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY) || sessionStorage.getItem(this.TOKEN_KEY);
  }

  private loadStoredUser(): void {
    const userData = localStorage.getItem(this.USER_KEY);
    if (userData) {
      this.currentUser.set(JSON.parse(userData));
    }
  }

  getCurrentUser() {
    return this.currentUser;
  }
} 