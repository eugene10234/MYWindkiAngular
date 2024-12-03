import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forget',
  templateUrl: './forget.component.html',
  styleUrls: ['./forget.component.css']
})
export class ForgetComponent {
  account: string = '';
  email: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(private http: HttpClient,private router: Router) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.account.trim()) {
      this.errorMessage = '請輸入帳號';
      return;
    }

    if (!this.email.trim() || !this.validateEmail(this.email)) {
      this.errorMessage = '請輸入有效的電子郵件';
      return;
    }
    console.log( {
      account: this.account,
      email: this.email
    });
    this.isLoading = true;
    console.log(`${environment.server.baseUrl}/Password/forget`);
    this.http.post(`${environment.server.baseUrl}/Password/forget`, {
      account: this.account,
      email: this.email
    }).subscribe({
      next: (response: any) => {
        this.successMessage = '重設密碼連結已寄出，請查看您的信箱';
        const message = {
          successMessage: this.successMessage,
          account: this.account,
          email: this.email
        };
        alert(JSON.stringify(message.successMessage));
        this.router.navigate(['/mainpage']);
      },
      error: (error) => {
        this.errorMessage = error.error.message || '發生錯誤，請稍後再試';
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  onDemoClick(): void {
    this.account = 'jack10';
    this.email = 'eugeneshih007@gmail.com';
  }

  private validateEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }
}
