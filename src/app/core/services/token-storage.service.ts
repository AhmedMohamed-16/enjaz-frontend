import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  private tokenSignal = signal<string | null>(null);

  setToken(token: string): void {
    this.tokenSignal.set(token);
  }

  getToken(): string | null {
    return this.tokenSignal();
  }

  clearToken(): void {
    this.tokenSignal.set(null);
  }

  isAuthenticated = computed(() => this.tokenSignal() !== null);
}
