import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TProductService {
  private apiUrl = 'https://localhost:7012/api/Tproducts'; // 替換為你的 API URL

  constructor(private http: HttpClient) { }

  getTProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getTProduct(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  addTProduct(product: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, product);
  }

  updateTProduct(id: number, product: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, product);
  }

  deleteTProduct(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  searchProducts(query: string): Observable<any[]> {
    const url = `${this.apiUrl}/search?query=${query}`;
    return this.http.get<any[]>(url);
  }
}
