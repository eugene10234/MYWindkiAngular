import { Component } from '@angular/core';

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent {
  passwordData: PasswordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  passwordStrength = 0;
  strengthText = '';

  hasMinLength = false;
  hasUpperCase = false;
  hasLowerCase = false;
  hasNumber = false;
  hasSpecialChar = false;

  checkPasswordStrength() {
    const password = this.passwordData.newPassword;

    this.hasMinLength = password.length >= 8;
    this.hasUpperCase = /[A-Z]/.test(password);
    this.hasLowerCase = /[a-z]/.test(password);
    this.hasNumber = /[0-9]/.test(password);
    this.hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const validCount = [
      this.hasMinLength,
      this.hasUpperCase,
      this.hasLowerCase,
      this.hasNumber,
      this.hasSpecialChar
    ].filter(Boolean).length;

    this.passwordStrength = validCount;

    switch (validCount) {
      case 0:
      case 1:
        this.strengthText = '弱';
        break;
      case 2:
        this.strengthText = '中';
        break;
      case 3:
        this.strengthText = '良好';
        break;
      case 4:
      case 5:
        this.strengthText = '強';
        break;
    }
  }

  isFormValid(): boolean {
    return (
      !!this.passwordData.currentPassword &&
      !!this.passwordData.newPassword &&
      !!this.passwordData.confirmPassword &&
      this.passwordData.newPassword === this.passwordData.confirmPassword &&
      this.passwordStrength >= 3
    );
  }

  changePassword() {
    if (!this.isFormValid()) {
      return;
    }

    // 實作密碼變更邏輯
    console.log('變更密碼：', this.passwordData);
  }

  resetForm() {
    this.passwordData = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
    this.passwordStrength = 0;
    this.strengthText = '';
  }
}
