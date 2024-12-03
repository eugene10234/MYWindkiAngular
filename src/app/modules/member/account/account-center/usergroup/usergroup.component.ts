import { Component, OnInit } from '@angular/core';

interface UserGroup {
  id: number;
  name: string;
  description: string;
  memberCount: number;
  joinDate: string;
  canLeave: boolean;
}

@Component({
  selector: 'app-usergroup',
  templateUrl: './usergroup.component.html',
  styleUrls: ['./usergroup.component.css']
})
export class UsergroupComponent implements OnInit {
  userGroups: UserGroup[] = [];
  availableGroups: UserGroup[] = [];

  constructor() { }

  ngOnInit(): void {
    this.loadUserGroups();
    this.loadAvailableGroups();
  }

  loadUserGroups() {
    // 模擬從API獲取資料
    this.userGroups = [
      {
        id: 1,
        name: '程式設計群組',
        description: '討論程式設計相關話題',
        memberCount: 150,
        joinDate: '2023-01-15',
        canLeave: true
      },
      {
        id: 2,
        name: 'VIP會員',
        description: '尊榮會員專屬群組',
        memberCount: 50,
        joinDate: '2023-03-20',
        canLeave: false
      }
    ];
  }

  loadAvailableGroups() {
    // 模擬從API獲取資料
    this.availableGroups = [
      {
        id: 3,
        name: '攝影愛好者',
        description: '分享攝影作品與技巧',
        memberCount: 200,
        joinDate: '',
        canLeave: true
      }
    ];
  }

  joinGroup(groupId: number) {
    console.log('加入群組：', groupId);
    // 實作加入群組邏輯
  }

  leaveGroup(groupId: number) {
    console.log('退出群組：', groupId);
    // 實作退出群組邏輯
  }
}
