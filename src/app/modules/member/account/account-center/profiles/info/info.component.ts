import { Component, OnInit } from '@angular/core';

interface UserInfo {
  name: string;
  nickname: string;
  birthday: string;
  gender: string;
}

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {
  userInfo: UserInfo = {
    name: '',
    nickname: '',
    birthday: '',
    gender: ''
  };

  constructor() { }

  ngOnInit(): void {
    this.loadUserInfo();
  }

  loadUserInfo() {
    // 模擬從API獲取資料
    this.userInfo = {
      name: '王小明',
      nickname: 'Ming',
      birthday: '1990-01-01',
      gender: 'male'
    };
  }

  saveInfo() {
    console.log('儲存的基本資料：', this.userInfo);
    // 實作API儲存邏輯
  }
}
