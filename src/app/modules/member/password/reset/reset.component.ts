import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { JwtHelper } from 'src/app/login-helper/helpers/jwt.helper';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {
  token: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;
  jwtHelper = inject(JwtHelper);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {

    this.token = this.route.snapshot.queryParams['token'];
    if (!this.token) {
      alert('無效的重設連結');
      this.router.navigate(['/']);
      return;
    }
    //alert('1');
    //alert('token: ' + this.token);
    try {
      const decodedToken = this.jwtHelper.decodeToken(this.token);
      console.log('解碼後的 token:', decodedToken);
      if (this.jwtHelper.isTokenExpired(this.token) ||
          decodedToken.purpose !== 'reset_password') {
            //alert('2');
        this.errorMessage = '無效或過期的重設連結';
        alert(this.errorMessage);
        this.router.navigate(['/']);
      }
    } catch (error) {
      //console.error('JWT 解析錯誤:', error);
      this.errorMessage = '無效的重設連結';
    }
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.newPassword || this.newPassword.length < 6) {
      this.errorMessage = '密碼長度至少需要6個字元';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = '兩次輸入的密碼不相符';
      return;
    }

    this.isLoading = true;

    this.http.post(`${environment.server.baseUrl}/Password/reset`, {
      token: this.token,
      newPassword: this.newPassword
    }).subscribe({
      next: () => {
        this.successMessage = '密碼已成功重設，請重新登入';
        alert(this.successMessage);
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
        this.router.navigate(['/mainpage']);
      },
      error: (error) => {
        this.errorMessage = error.error.message || '重設密碼失敗，請重新申請';
        alert(this.errorMessage);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  onDemoClick(): void {
    this.newPassword = 'pass1234';
    this.confirmPassword = 'pass1234';
  }
}
