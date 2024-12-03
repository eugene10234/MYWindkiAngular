import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MarketDataService {
  private apiUrl = 'https://openapi.twse.com.tw/v1/exchangeReport/BWIBBU_ALL';

  constructor(private http: HttpClient) {}

  getMarketData(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
