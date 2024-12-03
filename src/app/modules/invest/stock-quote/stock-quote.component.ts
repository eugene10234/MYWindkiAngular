import { Component } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { StockQuote } from '../Models/stock-quote.model';
import { StockQuoteService } from '../services/stock-quote.service';

@Component({
  selector: 'app-stock-quote',
  templateUrl: './stock-quote.component.html',
  styleUrls: ['./stock-quote.component.css']
})
export class StockQuoteComponent {
  stockSymbol: string = ''; // 使用者輸入的股票代碼
  stockData: StockQuote | null = null;
  errorMessage: string | null = null; // 錯誤訊息

  constructor(private stockQuoteService: StockQuoteService) {}

  // 搜尋股票的方法
  searchStock() {
    if (!this.stockSymbol) {
      this.errorMessage = '請輸入股票代碼';
      this.stockData = null;
      return;
    }

    // 使用 StockQuoteService 查詢股票資料
    this.stockQuoteService.getStockQuote(this.stockSymbol).subscribe(
      (data) => {
        this.stockData = data; // 成功獲取資料時顯示資料
        this.errorMessage = null; // 清除錯誤訊息
      },
      (error) => {
        this.stockData = null; // 清除現有資料
        this.errorMessage = '查無相關資訊，請重新輸入'; // 顯示錯誤訊息
        console.error('獲取股票資料時出錯:', error);
      }
    );
  }

}
