import { TTranRecordService } from './../servies/ttran-record.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StockQuoteService } from '../services/stock-quote.service';
import { quote } from '@fugle/marketdata/lib/rest/stock/intraday/quote';
import { TranRecord } from '../Models/tran-record.model';


@Component({
  selector: 'app-similate-order',
  templateUrl: './similate-order.component.html',
  styleUrls: ['./similate-order.component.css']
})
export class SimilateOrderComponent implements OnInit {
  memberId: string = '';
  symbol: string = '';
  stockName: string = ''; // 股票名稱
  lastPrice: number = 0;
  quantity: number = 1; // 預設張數

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public stockQuoteService: StockQuoteService,
    public tTranRecordService: TTranRecordService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.memberId = params['memberId'] || 'M0000000003';
      this.symbol = params['symbol'];
      this.stockName = params['stockName'];
      this.lastPrice = +params['lastPrice'];
    });
  }

  // 模擬下單
  placeOrder() {
    if (this.quantity <= 0) {
      alert('張數必須為正數！');
      return;
    }

    // 調用股票即時行情服務
    this.stockQuoteService.getStockQuote(this.symbol).subscribe({
      next: (quote) => {
        const latestPrice = quote.lastTrade.price; // 最新價
        const totalPrice = latestPrice * this.quantity * 1000; // 總價計算
        const confirmMessage =
          `是否確認要下單？\n` +
          `最新價: ${latestPrice}\n` +
          `張數: ${this.quantity}\n` +
          `總價: ${totalPrice}`;

        if (confirm(confirmMessage)) {
          // 組建交易記錄
          const transaction: TranRecord = {
            fMemberId: this.memberId,
            fStockId: this.symbol,
            fBrokerId: 'BR0001',
            fBuySell: '買進',
            fTranType: '現股',
            fStockPrice: latestPrice,
            fStockQty: this.quantity*1000,
            fTranTime: new Date().toISOString(), // 系統時間
          };

          // 呼叫 API 寫入交易記錄
          this.tTranRecordService.addTransaction(transaction).subscribe({
            next: (createdRecord) => {
              alert(
                `下單成功！\n` +
                `交易編號: ${createdRecord.fTranId}\n` +
                `最新價: ${latestPrice}\n` +
                `張數: ${this.quantity}\n` +
                `總價: ${totalPrice}`
              );
            },
            error: () => {
              alert('下單失敗，請稍後再試');
            },
          });
        }
      },
      error: () => {
        alert('無法獲取最新價，請稍後再試。');
      }
    });
  }

  // 返回上一頁
  goBack() {
    this.router.navigate(['invest/general-invest']);
  }

  goToMarketIndex() {
    this.router.navigate(['invest/market-index']);
  }
}

