import { Component, OnInit } from '@angular/core';

interface MailSettings {
  newsLetter: boolean;
  activityNotice: boolean;
  systemNotice: boolean;
  promotionNotice: boolean;
  messageNotice: boolean;
}

@Component({
  selector: 'app-sendmail',
  templateUrl: './sendmail.component.html',
  styleUrls: ['./sendmail.component.css']
})
export class SendmailComponent implements OnInit {
  mailSettings: MailSettings = {
    newsLetter: false,
    activityNotice: false,
    systemNotice: true,
    promotionNotice: false,
    messageNotice: true
  };

  constructor() { }

  ngOnInit(): void {
    this.loadMailSettings();
  }

  loadMailSettings() {
    // 模擬從API獲取資料
    this.mailSettings = {
      newsLetter: true,
      activityNotice: true,
      systemNotice: true,
      promotionNotice: false,
      messageNotice: true
    };
  }

  saveMailSettings() {
    // 實作儲存邏輯
    console.log('儲存郵件通知設定：', this.mailSettings);
  }
}
