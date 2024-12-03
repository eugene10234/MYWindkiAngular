import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { TranRecord } from '../Models/tran-record.model';

@Injectable({
  providedIn: 'root'
})
export class TTranRecordService {

  private apiUrl = 'https://localhost:7012/api/TTranRecords'; // 後端 API URL

  constructor(private http: HttpClient) {}

  // 根據會員編號獲取交易紀錄
  getTransactionsByMemberId(fMemberId: string): Observable<TranRecord[]> {
    return this.http.get<TranRecord[]>(`${this.apiUrl}/member/${fMemberId}`);
  }

  addTransaction(tranRecord: TranRecord): Observable<TranRecord> {
    return this.http.post<TranRecord>(this.apiUrl, tranRecord);
  }
}
