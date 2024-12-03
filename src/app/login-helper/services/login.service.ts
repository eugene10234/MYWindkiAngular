import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';

import { environment } from 'src/environments/environment';
import { LoginPost } from './interfaces/login.model';
import { JwtPayload } from './interfaces/jwt-payload.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  //public islogin: boolean = false;
  private url = environment.server.baseUrl + '/IAccount';
  private loginFormVisibleSource = new BehaviorSubject<boolean>(false);
  loginFormVisible$ = this.loginFormVisibleSource.asObservable();

  private loginstatus = new BehaviorSubject<boolean>(false);
  loginstatus$ = this.loginstatus.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loginstatus.next(this.checkLoginStatus());

    // this.loginstatus$.subscribe(status => {
    //   this.islogin = status;
    // });
    this.currentUserSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem('currentUser') || 'null')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  jwtpostback(hello: string) {
    //alert(this.url + '/jwtpostback');
    return this.http.post(this.url + '/jwtpostback?hello=111', null);
  }

  JWTLoginApi(loginValue: LoginPost) {
    //console.log(loginValue);
    return this.http.post(this.url + '/jwtPersonLogin', loginValue);
  }
  JWTGoogleLoginApi(idToken: string) {
    //console.log(loginValue);
    const httpOptions = this.makeJwtHeader(idToken);
    return this.http.get(this.url + '/jwtGoogleLogin', httpOptions);
  }
  JWTLogin(data: any) {
    //console.log(data);
    if (data.success === true) {
      localStorage.setItem('jwt', data.token);
      this.updateLoginStatus();

      this.toggleLoginForm(false);
      alert('登入成功');
      this.router.navigate(['/mainpage']);
    } else {
      alert(data.Message)
    }
  }
  JWTLogout() {

    localStorage.removeItem('jwt');
    this.toggleLoginForm(false);
    this.updateLoginStatus();
    alert('已登出');
    this.router.navigate(['/mainpage']);

  }
  makeJwtHeader(idToken: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
        'Authorization': `Bearer ${idToken}`
      }),
      withCredentials: true
    };
    return httpOptions;
  }
  toggleLoginForm(show: boolean) {
    this.loginFormVisibleSource.next(show);
  }
  getpayload(): JwtPayload | null {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      var payload = JSON.parse(window.atob(jwt.split('.')[1])) as JwtPayload;
      //alert(payload.MemberId);
      return payload;
    }
    return null;
  }
  private checkLoginStatus(): boolean {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      const payload = JSON.parse(window.atob(jwt.split('.')[1]));
      const exp = new Date(Number(payload.exp) * 1000);
      return new Date() <= exp;
    }
    return false;
  }

  updateLoginStatus() {
    this.loginstatus.next(this.checkLoginStatus());
  }
  //-------------------------------------
  private readonly API_URL = 'your-api-url';
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  // Google 登入
  googleLogin(googleToken: string) {
    return this.http.post<any>(`${this.API_URL}/auth/google/login`,{googleToken})
      .pipe(
        tap(response => this.handleAuthResponse(response))
      );
  }
  // 本地登入
  login(email: string, password: string) {
    return this.http.post<any>(`${this.API_URL}/auth/login`,{email,password})
      .pipe(
        tap(response => this.handleAuthResponse(response))
      );
  }
  // 刷新 Token
  refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token'));
    }
    return this.http.post<any>(`${this.API_URL}/auth/refresh-token`, { refreshToken })
      .pipe(
        tap(response => this.handleAuthResponse(response)),
        catchError(error => {
          this.logout();
          return throwError(() => error);
        })
      );
  }
  // 登出
  logout() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      this.http.post(`${this.API_URL}/auth/revoke-token`, { refreshToken }).subscribe();
    }
    localStorage.removeItem('currentUser');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.currentUserSubject.next(null);
  }
  private handleAuthResponse(response: any) {
    if (response.accessToken) {
      localStorage.setItem('currentUser', JSON.stringify(response.user));
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      this.currentUserSubject.next(response.user);
    }
    return response;
  }
}


