import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HelpService } from '../../help.service';


@Component({
  selector: 'app-requesthelpsure',
  templateUrl: './requesthelpsure.component.html',
  styleUrls: ['./requesthelpsure.component.css']
})
export class RequesthelpsureComponent implements OnInit {
  formData: any;
  districtMap: { [key: string]: string } = {
    '1': '中正區',
    '2': '大同區',
    '3': '中山區',
    '4': '松山區',
    '5': '大安區',
    '6': '萬華區',
    '7': '信義區',
    '8': '士林區',
    '9': '北投區',
    '10': '內湖區',
    '11': '南港區',
    '12': '文山區'
  };

  // 定義類別對照表
  helpClassMap: { [key: string]: string } = {
    '1': '技術類',
    '2': '生活類',
    '3': '勞力類',
    '4': '腦力類',
    '5': '教育類',

  };
  helpClassImages: { [key: string]: string } = {
    '1': 'assets/helping1/images/hammer.png',     // 技術類
    '2': 'assets/helping1/images/lifestyle.png',    // 生活類
    '3': 'assets/helping1/images/clean.png', // 勞力類
    '4': 'assets/helping1/images/teach.png',   // 腦力類
    '5': 'assets/helping1/images/teaching.png', // 教育類
  };
  constructor(
    private router: Router,
    private helpService: HelpService
  ) { }

  ngOnInit(): void {
    // 獲取表單資料
    this.formData = this.helpService.getFormData();
  }
  // 更新模板顯示
  getDisplayData() {
    return {
      // 轉換區域 ID 為中文名稱
      districtID: this.districtMap[this.formData.districtId] || '',

      // 取姓名第一個字並加上稱謂
      name: this.formData.name,

      // 轉換類別 ID 為中文名稱
      helpClass: this.helpClassMap[this.formData.helpClass] || '',

      content: this.formData.helpContent || '',

      points: this.formData.points ? `${this.formData.points}點` : ''
    };
  }
  getHelpClassImage(): string {
    return this.helpClassImages[this.formData.helpClass] || 'assets/helping1/images/default.png';
  }

  // 根據名字判斷稱謂（這裡可以根據實際需求修改判斷邏輯）
  private getGenderTitle(name: string): string {
    // 這裡可以添加更複雜的邏輯來判斷稱謂
    return '先生';  // 預設都顯示"先生"
  }

  getCurrentDate(): string {
    const today = new Date();
    const month = today.getMonth() + 1; // getMonth() 返回 0-11
    const date = today.getDate();

    return `${month}月${date}日`;
  }



  makeSure() {
    // 準備要發送的資料
    const requestData = {
      ...this.formData,
      createTime: new Date(),
      status: 1  // 假設 1 代表新建立的求助
    };

    // 發送資料到後端
    this.helpService.addHelp(requestData).subscribe({
      next: (response) => {
        console.log('資料發送成功:', response);
        // 清除暫存的表單資料
        this.helpService.clearFormData();
        // 導航到完成頁面
        this.router.navigate(['/help/donetwo']);
      },
      error: (error) => {
        // 更詳細的錯誤記錄
        console.error('錯誤詳情:', {
          status: error.status,
          message: error.message,
          error: error.error
        });

        // 根據錯誤類型顯示不同訊息
        if (error.status === 0) {
          alert('無法連接到伺服器，請檢查網路連接');
        } else if (error.status === 400) {
          alert('請求資料格式不正確：' + (error.error?.message || '未知錯誤'));
        } else if (error.status === 401) {
          alert('請先登入');
        } else {
          alert(`發送失敗（錯誤碼：${error.status}），請稍後再試`);
        }
      }
    });
  }
}
