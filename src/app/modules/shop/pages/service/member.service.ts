import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private apiUrl = environment.server.baseUrl;  // 假設在 environment.ts 中定義了 API 的基礎 URL

  constructor(private http: HttpClient) { }

  getMemberByUserId(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/TPersonMembers/${userId}`);
  }
  getMemberPoints(userId: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/api/TPersonMembers/points/person/${userId}`);
  }

}
