import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly email = 'admin@test.com';
  private readonly password = 'admin123';

  login(email: string, password: string): boolean {
    const ok = email === this.email && password === this.password;
    if (ok) {
      localStorage.setItem('loggedIn', 'true');
    }
    return ok;
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('loggedIn') === 'true';
  }

  logout(): void {
    localStorage.removeItem('loggedIn');
  }
}
