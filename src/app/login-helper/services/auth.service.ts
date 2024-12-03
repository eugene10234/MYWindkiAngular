import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('jwt');
    if (token) {
      const decodedToken = this.parseJwt(token);
      this.currentUserSubject.next(decodedToken);
    }
  }

  private parseJwt(token: string) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(window.atob(base64));
    } catch (error) {
      console.error('解析 token 失敗:', error);
      return null;
    }
  }

  getUserId(): Observable<string> {
    return this.currentUser$.pipe(
      map(user => user?.MemberId)
    );
  }

  isAuthenticated(): Observable<boolean> {
    return this.currentUser$.pipe(
      map(user => !!user)
    );
  }

  getUserName(): Observable<string> {
    return this.currentUser$.pipe(
      map(user => user?.UserName || user?.MemberId)
    );
  }
}
