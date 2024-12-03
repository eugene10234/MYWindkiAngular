import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { HelpService, HelpRequest } from '../../help.service';


@Component({
  selector: 'app-donetwo',
  templateUrl: './donetwo.component.html',
  styleUrls: ['./donetwo.component.css']
})
export class DonetwoComponent implements OnInit {
  latestHelp: HelpRequest | null = null;
  loading: boolean = false;
  error: string = '';

  constructor(
    private router: Router,
    private helpService: HelpService) { }

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
  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    });
    // 載入最新的求助資料
    this.loadLatestHelp();
  }


  backtomain() {
    this.router.navigate(['/help/main']);
  }
  gotomakesure() {
    // 直接導航到 management 頁面並設定要顯示的內容
    this.router.navigate(['/help/management'], {
      queryParams: { content: 'request' }
    });
  }


  private loadLatestHelp() {
    this.loading = true;
    this.helpService.getLatestHelp().subscribe({
      next: (data) => {
        console.log('最新求助資料:', data);
        this.latestHelp = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('獲取最新求助資料失敗:', error);
        this.error = `載入資料失敗: ${error.message || '未知錯誤'}`;
        this.loading = false;
      }
    });
  }
  // 轉換 helpClass 數字為文字
  getHelpClassName(helpClass: number): string {
    switch (helpClass) {
      case 1: return '技術類';
      case 2: return '生活類';
      case 3: return '勞力類';
      case 4: return '腦力類';
      case 5: return '教育類';
      default: return '錯誤';
    }
  }
  getDistrictName(districtId: number): string {
    const districtMap: { [key: number]: string } = {
        1: '中正區',
        2: '大同區',
        3: '中山區',
        4: '松山區',
        5: '大安區',
        6: '萬華區',
        7: '信義區',
        8: '士林區',
        9: '北投區',
        10: '內湖區',
        11: '南港區',
        12: '文山區'
    };
    return districtMap[districtId] || '未知區域';
}
  getDisplayData() {
    return {
      // 轉換區域 ID 為中文名稱
      districtID: this.districtMap[this.latestHelp?.districtId || ''] || '',

    };
  }

  // 格式化日期
  formatDate(date: Date): string {
    const d = new Date(date);
    return `${d.getMonth() + 1}月${d.getDate()}日`;
  }

}
