import { Injectable } from '@angular/core';
import { Observable, catchError, forkJoin } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import {  throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orderApiUrl = 'https://localhost:7012/api/TOrder';
  private orderDetailsApiUrl = 'https://localhost:7012/api/Order/OrderDetails/ByOrderId';
  private productApiUrl = 'https://localhost:7012/api/TProducts';
  private orderDetailApiUrl = 'https://localhost:7012/api/TOrderDetail';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  constructor(private http: HttpClient) {}


  getOrderDetailsByOrderId(orderId: string): Observable<any> {
    const orderRequest = this.http.get(`${this.orderApiUrl}/${orderId}`);
    const orderDetailsRequest = this.http.get(`${this.orderDetailsApiUrl}/${orderId}`);
    return forkJoin([orderRequest, orderDetailsRequest]);
  }
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error.error);
    return throwError('Something bad happened; please try again later.');
  }

  getOrderById(orderId: string): Observable<any> {
    return this.http.get<any>(`${this.orderApiUrl}/${orderId}`, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  getProductById(productId: string): Observable<any> {
    return this.http.get(`${this.productApiUrl}/${productId}`);
  }// Add this method to your OrderService

  getOrdersByMemberId(memberId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.orderApiUrl}/${memberId}`, this.httpOptions).pipe(
      catchError(this.handleError)
    );}

    getOrdersByPersonSid(personSid: string): Observable<any[]> {
      return this.http.get<any[]>(`${this.orderApiUrl}/person/${personSid}`, this.httpOptions).pipe(
        catchError(this.handleError)
      );
    }

    createOrderDetails(orderDetails: any): Observable<any> {
      console.log('Sending order details:', orderDetails); // 添加日誌
      return this.http.post(
        `${this.orderDetailApiUrl}`,
        orderDetails.tOrderDetail[0], // 修改：直接發送單個訂單明細
        this.httpOptions
      ).pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('API Error:', error);
          if (error.error instanceof ErrorEvent) {
            // 客戶端錯誤
            return throwError(() => new Error(`Client-side error: ${error.error.message}`));
          } else {
            // 伺服器端錯誤
            return throwError(() => new Error(`Server error: ${error.status} - ${error.error?.message || 'Unknown error'}`));
          }
        })
      );
    }
  }
