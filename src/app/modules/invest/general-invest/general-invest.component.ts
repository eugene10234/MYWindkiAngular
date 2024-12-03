import { Component } from '@angular/core';
import { BrokerService } from '../services/broker.service';
import { TBroker } from '../Models/tbroker.module';
import { StockServiceService } from '../services/stock-service.service';
import { StockQuoteService } from '../services/stock-quote.service';
import { Stock} from '../Models/stock.model';
import { StockQuote } from '../Models/stock-quote.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-general-invest',
  templateUrl: './general-invest.component.html',
  styleUrls: ['./general-invest.component.css']
})
export class GeneralInvestComponent  {
  query = '';
  searchResults: Stock[] = [];
  selectedStockId: string | null = null; // 單選的股票代號
  selectedStockQuote: StockQuote | null = null; // 單選股票的資訊
  fMemberId = 'M0000000003'; // 強制設定登入帳號

  constructor(
    public stockService: StockServiceService,
    public stockQuoteService: StockQuoteService,
    public router: Router
  ) {}

  // 搜尋股票
  onSearch() {
    this.stockService.searchStocks(this.query).subscribe(results => {
      this.searchResults = results;
    });
  }

  // 當選擇股票時，立即調用 stock-quote service
  onSelectStock(stockId: string) {
    this.selectedStockId = stockId;
    this.stockQuoteService.getStockQuote(stockId).subscribe(quote => {
      this.selectedStockQuote = {
        ...quote,
        lastUpdated: this.convertToMilliseconds(quote.lastUpdated), // 確保為毫秒級
      };
    });
  }

  // 導航到模擬下單頁面
  navigateToOrder() {
    this.router.navigate(['/invest/similate-order'], {
      queryParams: {
        memberId: this.fMemberId,
        symbol: this.selectedStockQuote?.symbol,
        stockName: this.selectedStockQuote?.name, // 傳遞股票名稱
        lastPrice: this.selectedStockQuote?.lastPrice
      }
    });
  }

  /**
   * 將微秒級時間戳轉換為毫秒級
   */
  private convertToMilliseconds(microseconds: number): number {
    return Math.floor(microseconds / 1000); // 轉換為毫秒級
  }

}
