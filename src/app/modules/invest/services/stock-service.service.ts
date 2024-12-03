import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Stock } from '../Models/stock.model';

@Injectable({
  providedIn: 'root'
})
export class StockServiceService {

  public apiUrl = 'https://localhost:7012/api/TStocks';

  constructor(private http: HttpClient) { }

  searchStocks(query: string): Observable<Stock[]> {
    return this.http.get<Stock[]>(`${this.apiUrl}/search?query=${query}`);
  }
}
