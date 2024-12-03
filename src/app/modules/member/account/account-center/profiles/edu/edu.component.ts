import { Component, OnInit } from '@angular/core';

interface Education {
  school: string;
  major: string;
  startDate: string;
  endDate: string;
}

@Component({
  selector: 'app-edu',
  templateUrl: './edu.component.html',
  styleUrls: ['./edu.component.css']
})
export class EduComponent implements OnInit {
  educations: Education[] = [];

  constructor() { }

  ngOnInit(): void {
    this.loadEducations();
  }

  loadEducations() {
    // 模擬從API獲取資料
    this.educations = [{
      school: '台灣大學',
      major: '資訊工程學系',
      startDate: '2010-09',
      endDate: '2014-06'
    }];
  }

  addEducation() {
    this.educations.push({
      school: '',
      major: '',
      startDate: '',
      endDate: ''
    });
  }

  removeEducation(index: number) {
    this.educations.splice(index, 1);
  }

  saveEducations() {
    console.log('儲存的教育背景：', this.educations);
    // 實作API儲存邏輯
  }
}
