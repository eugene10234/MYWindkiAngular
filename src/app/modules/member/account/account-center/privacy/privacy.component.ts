import { Component, OnInit } from '@angular/core';

interface PrivacySettings {
  profileVisible: boolean;
  emailVisible: boolean;
  phoneVisible: boolean;
  birthdayVisible: boolean;
  educationVisible: boolean;
  workVisible: boolean;
}

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.css']
})
export class PrivacyComponent implements OnInit {
  privacySettings: PrivacySettings = {
    profileVisible: false,
    emailVisible: false,
    phoneVisible: false,
    birthdayVisible: false,
    educationVisible: false,
    workVisible: false
  };

  constructor() { }

  ngOnInit(): void {
    this.loadPrivacySettings();
  }

  loadPrivacySettings() {
    // 模擬從API獲取資料
    this.privacySettings = {
      profileVisible: true,
      emailVisible: false,
      phoneVisible: false,
      birthdayVisible: true,
      educationVisible: true,
      workVisible: true
    };
  }

  savePrivacySettings() {
    // 實作儲存邏輯
    console.log('儲存隱私設定：', this.privacySettings);
  }
}
