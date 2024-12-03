import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ChatgptService {

  constructor(private http: HttpClient) {

  }



  // chat(message: string): Observable<any> {
  //   const headers = new HttpHeaders()
  //     .set('Content-Type', 'application/json')
  //     .set('Authorization', `Bearer ${this.apiKey}`);

  //   const body = {
  //     model: 'gpt-3.5-turbo',
  //     messages: [{ role: 'user', content: message }],
  //     temperature: 0.7
  //   };
  //   console.log('Sending request with headers:', headers);  // 添加除錯訊息
  //   return this.http.post(this.apiUrl, body, { headers });
  // }

  chat(message: string): Observable<any> {
    const body = { message };

    return this.http.post('https://localhost:7012/api/OpenAI/Chat', body).pipe(
      catchError(error => {
        console.error('API Error:', error);
        return throwError(() => error);
      })
    );
  }













}

