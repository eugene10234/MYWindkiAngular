import { Component, OnInit } from '@angular/core';

interface WorkExperience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

@Component({
  selector: 'app-work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.css']
})
export class WorkComponent implements OnInit {
  workExperiences: WorkExperience[] = [];

  constructor() { }

  ngOnInit(): void {
    this.loadWorks();
  }

  loadWorks() {
    // 模擬從API獲取資料
    this.workExperiences = [{
      company: '範例科技公司',
      position: '軟體工程師',
      startDate: '2014-07',
      endDate: '2020-12',
      description: '負責前端開發與維護'
    }];
  }

  addWork() {
    this.workExperiences.push({
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: ''
    });
  }

  removeWork(index: number) {
    this.workExperiences.splice(index, 1);
  }

  saveWorks() {
    console.log('儲存的工作經歷：', this.workExperiences);
    // 實作API儲存邏輯
  }
}
