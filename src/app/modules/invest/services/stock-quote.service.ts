import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StockQuote } from '../Models/stock-quote.model';

@Injectable({
  providedIn: 'root'
})
export class StockQuoteService {
  public apiUrl = environment.fugle.baseUrl;
  public apiKey = environment.fugle.apiKey;

  constructor(private http: HttpClient) {}

  // 查詢股票資料
  getStockQuote(symbol: string): Observable<StockQuote> {
    const url = `${this.apiUrl}${symbol}`;
    const headers = new HttpHeaders({
      'X-API-KEY': this.apiKey,
    });

    return this.http.get<StockQuote>(url, { headers });
  }

}
