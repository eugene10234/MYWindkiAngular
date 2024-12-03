import { Router, Routes } from '@angular/router';
import { Component, OnInit, inject } from '@angular/core';

import { catchError } from 'rxjs';
import { LoginPost } from 'src/app/login-helper/services/interfaces/login.model';
import { LoginService } from 'src/app/login-helper/services/login.service';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Alert } from 'bootstrap';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  logindisplay: string = 'none';
  loginValue: LoginPost = {
    AccountName: '',
    Password: ''
  }
  constructor(private router: Router, private loginService: LoginService) {
    this.loginService.loginFormVisible$.subscribe(visible => {
      if (visible) {
        this.openForm();
      } else {
        this.closeForm();
      }
    });
    //-----------------------google-----------------------
    this.authService.authState.subscribe((user) => {
      this.user = user;
      if (user) {
        this.sendGoogleTokenToBackend(user.idToken);
      }
    });
  }
  ngOnInit() {
    // 動態載入 Google 客戶端腳本
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }

  login() {

    this.loginService.JWTLoginApi(this.loginValue).pipe(
      catchError(err => {
        console.log(err);
        throw err;
      })
    ).subscribe((data: any) => {
      //console.log(data);
      this.loginService.JWTLogin(data);
    })

    //this.router.navigateByUrl('');
  }
  jwtpostback() {
    this.loginService.jwtpostback("hello").subscribe((data: any) => {
      //console.log(data);


    })
  }

  closeForm() {
    this.logindisplay = 'none';
  }
  openForm() {
    this.logindisplay = 'flex';
  }
  //-----------------------demo1-----------------------
  demo1Value: LoginPost = {
    AccountName: 'hungyuooxx',
    Password: 'pass1'
  }
  demo1() {
    this.loginService.JWTLoginApi(this.demo1Value).pipe(
      catchError(err => {
        console.log(err);
        throw err;
      })
    ).subscribe((data: any) => {
      //console.log(data);
      this.loginService.JWTLogin(data);
    })
  }
  //-----------------------demo2-----------------------
  demo2Value: LoginPost = {
    AccountName: 'bob2',
    Password: 'pass1'
  }
  demo2() {
    this.loginService.JWTLoginApi(this.demo2Value).pipe(
      catchError(err => {
        console.log(err);
        throw err;
      })
    ).subscribe((data: any) => {
      //console.log(data);
      this.loginService.JWTLogin(data);
    })
  }
  demo3() {
    this.loginValue = {
      AccountName: 'jack10',
      Password: 'pass1234'
    };
  }
  //-----------------------google-----------------------
  user: SocialUser | null = null;
  private authService = inject(SocialAuthService);
  private http = inject(HttpClient);

  signOut(): void {
    this.authService.signOut();
  }

  sendGoogleTokenToBackend(idToken: string): void {
    //alert('aaaaaaaaaaaaaaaaaa');
    this.loginService.JWTGoogleLoginApi(idToken)
      .subscribe(response => {
        //alert(response);
        //console.log("Token verified, response from backend:", response);
        this.loginService.JWTLogin(response);
      });
  }

  //   makeRequest(idToken: string) {
  //     const httpOptions = {
  //         headers: new HttpHeaders({
  //              'Authorization': `Bearer ${idToken}`
  //         }),
  //         withCredentials: true
  //     };
  //     return this.http.get('https://localhost:7012/api/google/VerifyGoogleToken',httpOptions);
  // }
  // JWTGoogleLoginApi(idToken: string) {
  //   const httpOptions = this.makeJwtHeader(idToken);
  //   return this.http.get('https://localhost:7012/api/google/VerifyGoogleToken',httpOptions);
  // }
  // makeJwtHeader(idToken: string) {
  //   const httpOptions = {
  //       headers: new HttpHeaders({
  //            'Authorization': `Bearer ${idToken}`
  //       }),
  //       withCredentials: true
  //   };
  //   return httpOptions;
  // }
}
