import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, retry, tap, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  createOrderDetails(orderDetails: { tOrderDetail: { FOrderDetailId: number; FOrderId: number; FProductId: number | null; FAmount: number | null; FHelpPoint: number | null; }[]; }) {
    throw new Error('Method not implemented.');
  }
  private orderUrl = 'https://localhost:7012/api/TOrder';
  private orderDetailsUrl = 'https://localhost:7012/api/TOrderDetail';
  private apiUrl = 'https://localhost:7012/api';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  placeOrder(order: any): Observable<any> {
    return this.http.post<any>(this.orderUrl, order, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  getOrderById(orderId: number): Observable<any> {
    return this.http.get<any>(`${this.orderUrl}/${orderId}`, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  saveOrderDetails(orderDetails: any): Observable<any> {
    return this.http.post<any>(this.orderDetailsUrl, orderDetails, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error.error);
    return throwError('Something bad happened; please try again later.');
  }

    // 建立訂單明細
    createOrderDetail(orderDetail: any): Observable<any> {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });

      console.log('發送單筆訂單明細:', orderDetail);

      return this.http.post(`${this.apiUrl}/TOrderDetail`, orderDetail, { headers })
        .pipe(
          retry(1), // 添加重試邏輯
          catchError(error => {
            console.error('Error creating order detail:', error);
            if (error.status === 0) {
              console.error('可能是 CORS 或連接問題');
            }
            return throwError(() => error);
          })
        );
    }


    // 建立訂單
    createOrder(order: any): Observable<any> {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });

      return this.http.post(`${this.apiUrl}/TOrder`, order, { headers })
        .pipe(
          catchError(error => {
            console.error('Error creating order:', error);
            if (error.error) {
              console.error('Error details:', error.error);
            }
            return throwError(() => error);
          })
        );
    }
    getMemberByPersonSId(personSId: string): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}/TPersonMembers/${personSId}`).pipe(
        map(response => {
          console.log('API Response:', response); // 檢查響應
          return {
            fMemberId: response.fMemberId,
            fTotalHelpPoint: response.fTotalHelpPoint
          };
        }),
        catchError(error => {
          console.error('Error fetching member info:', error);
          return throwError(() => error);
        })
      );
    }

    getMemberPoints(memberId: string): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}/TPersonMembers/points/${memberId}`).pipe(
        map(response => response.fTotalHelpPoint),
        catchError(error => {
          console.error('Error fetching member points:', error);
          return throwError(() => error);
        })
      );
    }

  }
