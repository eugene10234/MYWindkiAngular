import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SignupService } from '../signup.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-personsignup',
  templateUrl: './personsignup.component.html',
  styleUrls: ['./personsignup.component.css']
})
export class PersonsignupComponent implements OnInit {
  signupForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private signupService: SignupService
  ) {
    this.signupForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      agreement: [false, [Validators.requiredTrue]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {}

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null
      : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.signupForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const signupData = {
        username: this.signupForm.value.username,
        password: this.signupForm.value.password,
        email: this.signupForm.value.email,
        agreement: this.signupForm.value.agreement
      };
      console.log(signupData);
      this.signupService.signup(signupData)
        .pipe(
          finalize(() => this.isSubmitting = false)
        )
        .subscribe({
          next: (response) => {
            console.log('註冊成功', response);
            alert('註冊成功！');
            this.router.navigate(['/mainpage']);
          },
          error: (error) => {
            console.error('註冊失敗', error);
            alert(error.error?.message || '註冊失敗，請稍後再試');
          }
        });
    } else {
      Object.keys(this.signupForm.controls).forEach(key => {
        const control = this.signupForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  fillDemoData() {
    this.signupForm.patchValue({
      username: 'demoUser123',
      password: 'Demo@123',
      confirmPassword: 'Demo@123',
      email: 'desmon@WandKi.com',
      agreement: true
    });
  }
}
