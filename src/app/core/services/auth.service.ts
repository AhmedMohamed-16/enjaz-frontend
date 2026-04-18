import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { finalize, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TokenStorageService } from './token-storage.service';
import { UserModel } from '../models/user.model';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';

export interface AuthResponse {
  accessToken: string;
  user: UserModel;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl =  environment.apiUrl+ '/auth';
  private currentUser = signal<UserModel | null>(null);
  readonly user = this.currentUser.asReadonly();
  readonly isLoggedIn = computed(() => this.currentUser() !== null);

  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenStorage: TokenStorageService
  ) {}

  register(data: { name: string; email: string; password: string }): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/register`, data, { withCredentials: true }).pipe(
      tap(() => {
        this.router.navigate(['/auth/login'], { queryParams: { registered: true } });
      })
    );
  }

  login(data: { email: string; password: string }): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.baseUrl}/login`, data, { withCredentials: true }).pipe(
      tap((response) => {
        this.tokenStorage.setToken(response.data.accessToken);
        console.log("response.accessToken", response);

        this.currentUser.set(response.data.user);
        this.router.navigate(['/tasks']);
      })
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/logout`, null, { withCredentials: true }).pipe(
      finalize(() => {
        this.tokenStorage.clearToken();
        this.currentUser.set(null);
        this.router.navigate(['/auth/login']);
      })
    );
  }

  refreshToken(): Observable<string> {
    return this.http.post<{ accessToken: string }>(`${this.baseUrl}/refresh-token`, null, { withCredentials: true }).pipe(
      tap((response) => {
        this.tokenStorage.setToken(response.accessToken);
      }),
      map((response) => response.accessToken)
    );
  }

  getCurrentUser(): Observable<UserModel> {
    return this.http.get<UserModel>(`${this.baseUrl}/me`, { withCredentials: true }).pipe(
      tap((user) => {
        this.currentUser.set(user);
      })
    );
  }

  isAuthenticated(): boolean {
    return this.tokenStorage.isAuthenticated();
  }
}
