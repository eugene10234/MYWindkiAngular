import { Component } from '@angular/core';
import { MarketDataService } from '../services/market-data.service';


@Component({
  selector: 'app-market-info',
  templateUrl: './market-info.component.html',
  styleUrls: ['./market-info.component.css']
})
export class MarketInfoComponent {

  marketData: any[] = [];
  errorMessage: string = '';

  constructor(private marketDataService: MarketDataService) {}

  ngOnInit(): void {
    this.fetchMarketData();
  }

  fetchMarketData() {
    this.marketDataService.getMarketData().subscribe({
      next: (data) => {
        this.marketData = data;
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = '無法取得資料，請稍後再試。';
        this.marketData = [];
      }
    });
  }


}
