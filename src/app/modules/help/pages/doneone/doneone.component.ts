import { Component, OnInit } from '@angular/core';
import { Router,NavigationEnd  } from '@angular/router';
import { HelperService, MatchDTO } from '../../helper.service';




@Component({
  selector: 'app-doneone',
  templateUrl: './doneone.component.html',
  styleUrls: ['./doneone.component.css']
})
export class DoneoneComponent implements OnInit {
  latestHelp: MatchDTO | null = null;
  loading = false;
  error = '';

  constructor(
    private router: Router,
    private helperService: HelperService
  ) {}

  ngOnInit(): void {
    this.loadLatestMatch();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    });
  }

  loadLatestMatch() {
    this.loading = true;
    this.helperService.getLatestMatch().subscribe({
      next: (data) => {
        this.latestHelp = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = '載入資料失敗';
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }

  getHelpClassName(): string {
    if (!this.latestHelp) return '';
    const helpClassMap: { [key: number]: string } = {
      1: '技術類',
      2: '生活類',
      3: '勞力類',
      4: '腦力類',
      5: '教育類'
    };
    return helpClassMap[this.latestHelp.helpClass] || '其他類別';
  }

  getDistrictName(): string {
    if (!this.latestHelp) return '';
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
    return districtMap[this.latestHelp.districtId] || '未知區域';
  }

  formatDate(): string {
    if (!this.latestHelp) return '';
    const d = new Date();
    return d.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  backtomain() {
    this.router.navigate(['/help/main']);
  }

  gotomakesure() {
    this.router.navigate(['/help/management']);
  }
}
