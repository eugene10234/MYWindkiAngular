import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StockInStock } from '../Models/stock-in-stock.model';


@Injectable({
  providedIn: 'root'
})
export class StockInventoryService {

  private apiUrl = 'https://localhost:7012/api/TStockInStocks'; // 替換成您的 API URL

  constructor(private http: HttpClient) {}

  // 根據指定的 fMemberId 取得庫存資料
  getStockInStocks(fMemberId: string): Observable<StockInStock[]> {
    return this.http.get<StockInStock[]>(`${this.apiUrl}?fmemberId=${fMemberId}`);
  }

  // 新增庫存資料
  createStock(stock: StockInStock): Observable<StockInStock> {
    return this.http.post<StockInStock>(this.apiUrl, stock);
  }

  // 更新庫存資料
  updateStock(stock: StockInStock): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${stock.fInStockId}`, stock);
  }

  // 刪除庫存資料
  deleteStock(id: number, fMemberId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}?fmemberId=${fMemberId}`);
  }
}
