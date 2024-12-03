import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TBroker } from '../Models/tbroker.module';

@Injectable({
  providedIn: 'root'
})
export class BrokerService {
  private apiUrl = 'https://localhost:7012/api/TBrokers'; // 確認您的 API 基本 URL

  constructor(private http: HttpClient) {}

  // 獲取所有券商
  getAllBrokers(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  // 其他方法（如下單）可以在這裡定義
}
