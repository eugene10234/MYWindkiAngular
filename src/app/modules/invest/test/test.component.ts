import { Component } from '@angular/core';
import { StockServiceService } from '../services/stock-service.service';
import { Stock } from '../Models/stock.model';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent {

  searchResults: Stock[] = []; // 設定型別為 Stock[]
  query = '';
  noResults = false;

  constructor(private stockService: StockServiceService) { }

  onSearch() {
    this.stockService.searchStocks(this.query).subscribe(results => {
      this.searchResults = results;
      this.noResults = results.length === 0;
    });
  }
}
