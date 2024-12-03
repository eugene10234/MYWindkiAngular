import { Component, OnDestroy, OnInit, NgZone } from '@angular/core';
import { MarketIndex } from '../Models/market-index.model';
import { Subscription } from 'rxjs';
import { Candles } from '../Models/candles.model';
import { MarketIndexService } from './../services/market-index.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-market-index',
  templateUrl: './market-index.component.html',
  styleUrls: ['./market-index.component.css']
})
export class MarketIndexComponent implements OnInit, OnDestroy {

  public marketData: MarketIndex | null = null;
  public candlesData: Candles | null = null;
  private subscriptions: Subscription[] = [];

  constructor(
    private marketIndexService: MarketIndexService,
    public ngZone: NgZone,
    public router: Router
  ) { }

  ngOnInit(): void {
    // 建立 WebSocket 連接
    this.marketIndexService.connect();

    // 訂閱台股指數數據
    this.subscriptions.push(
      this.marketIndexService.getMarketIndex().subscribe({
        next: (data: MarketIndex) => {
          this.ngZone.run(() => {
            this.marketData = {
              ...data,
              formattedTime: this.formatTimestamp(data.time), // 格式化時間
            };
            console.log("D3 final",this.marketData);
          });
        },
        error: (err) => console.error('MarketIndex 訂閱錯誤:', err),
      })
    );

    // 訂閱 K 線數據
    this.subscriptions.push(
      this.marketIndexService.getCandles().subscribe({
        next: (data: Candles) => {
          console.log('接收到的 Candles 數據:', data);
          this.ngZone.run(() => {
            this.candlesData = data;
          });
        },
        error: (err) => console.error('Candles 訂閱錯誤:', err),
      })
    );
  }

  /**
   * 將微秒級 UNIX 時間戳轉換為本地時間字符串
   * @param microseconds 微秒級時間戳
   * @returns 格式化後的本地化時間字符串
   */
  private formatTimestamp(microseconds: number): string {
    const milliseconds = Math.floor(microseconds / 1000); // 微秒轉毫秒
    const date = new Date(milliseconds);
    return date.toLocaleString(); // 返回本地化格式
  }

  /**
   * 導航到模擬下單頁面
   */
  navigateToGeneralInvest(): void {
    this.router.navigate(['/invest/general-invest']);
  }

  /**
   * 導航到交易紀錄頁面
   */
  navigateToTranRecord(): void {
    this.router.navigate(['/invest/tran-record']);
  }

  /**
   * 導航到庫存損益頁面
   */
  navigateToStockInventory(): void {
    this.router.navigate(['/invest/stock-inventory']);
  }

  ngOnDestroy(): void {
    // 取消訂閱所有訂閱
    this.subscriptions.forEach((sub) => sub.unsubscribe());

    // 斷開 WebSocket 連接
    this.marketIndexService.disconnect();
  }


}
