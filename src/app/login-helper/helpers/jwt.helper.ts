import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtHelper {
  decodeToken(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }

  isTokenExpired(token: string): boolean {
    try {
      const decodedToken = this.decodeToken(token);
      const expirationDate = new Date(decodedToken.exp * 1000);
      return new Date() > expirationDate;
    } catch {
      return true;
    }
  }

  validateResetToken(token: string): boolean {
    try {
      const decodedToken = this.decodeToken(token);
      return !this.isTokenExpired(token) &&
             decodedToken?.purpose === 'reset_password';
    } catch {
      return false;
    }
  }
}
