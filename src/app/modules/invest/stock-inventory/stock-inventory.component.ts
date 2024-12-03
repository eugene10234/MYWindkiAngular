import { Component,OnInit } from '@angular/core';
import { StockInStock } from '../Models/stock-in-stock.model';
import { StockInventoryService } from '../services/stock-inventory.service';

@Component({
  selector: 'app-stock-inventory',
  templateUrl: './stock-inventory.component.html',
  styleUrls: ['./stock-inventory.component.css']
})
export class StockInventoryComponent {

  stockInStocks: StockInStock[] = [];
  fMemberId: string = 'M0000000003'; // 設定要查詢的會員編號
  newStock: StockInStock = {} as StockInStock; // 用於新增的庫存物件

  constructor(private stockService: StockInventoryService) {}

  ngOnInit(): void {
    this.loadStocks();
  }

  // 加載指定會員的庫存資料
  loadStocks(): void {
    this.stockService.getStockInStocks(this.fMemberId).subscribe(
      (data) => {
        this.stockInStocks = data;
      },
      (error) => {
        console.error('Error fetching stock data', error);
      }
    );
  }


}
