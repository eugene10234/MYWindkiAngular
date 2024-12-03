import { Component, OnInit } from '@angular/core';

interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
}

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  contactInfo: ContactInfo = {
    phone: '',
    email: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    isPhoneVerified: false,
    isEmailVerified: false
  };

  constructor() { }

  ngOnInit(): void {
    this.loadContactInfo();
  }

  loadContactInfo() {
    // 模擬從API獲取資料
    this.contactInfo = {
      phone: '0912345678',
      email: 'eugeneshih007@gmail.com',
      address: '台北市信義區信義路五段7號',
      emergencyContact: '王小明',
      emergencyPhone: '0987654321',
      isPhoneVerified: false,
      isEmailVerified: true
    };
  }

  verifyPhone() {
    // 實作手機驗證邏輯
    console.log('驗證手機號碼：', this.contactInfo.phone);
  }

  verifyEmail() {
    // 實作郵件驗證邏輯
    console.log('驗證電子郵件：', this.contactInfo.email);
  }

  resetForm() {
    this.loadContactInfo();
  }

  saveContact() {
    // 實作儲存邏輯
    console.log('儲存的聯絡資訊：', this.contactInfo);
  }
}
