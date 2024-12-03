import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface SignupData {
  username: string;
  password: string;
  email: string;
  agreement: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SignupService {
  private apiUrl = environment.server.baseUrl + '/Signup'; // 替換為實際的 API URL

  constructor(private http: HttpClient) {}

  signup(data: SignupData): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, data);
  }
}
