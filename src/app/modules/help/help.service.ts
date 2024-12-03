import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';


// 定義介面
export interface HelpRequest {
  name: string;
  email: string;
  phone?: string;  // 可選欄位
  helpClass: number;
  helpContent?: string;  // 可選欄位
  status: number;
  createTime: Date;
  address: string;
  districtId: number;
  points: number;
  latitude :number;
  longitude :number;
  helpId: number;
}
export interface District {
  fDistrictId: number; // 對應返回資料的 fDistrictId
  fDistrict: string;   // 對應返回資料的 fDistrict
}
export interface HelpClass {
  fHelpClassId: number; // 對應返回資料的 fHelpClassId
  fHelpClass: string;   // 對應返回資料的 fHelpClass
}

@Injectable({    // 修正：@ 符號要加在前面
  providedIn: 'root'
})
export class HelpService {
  private apiUrl = 'https://localhost:7012/api/Helps/';
  private dataApiUrl = 'https://localhost:7012/api/Datas/';
  private formData: any = {};




  constructor(private http: HttpClient,

  ) { }

  getAllHelps(): Observable<any[]> {
    return this.http.get<HelpRequest[]>('https://localhost:7012/api/Helps/AllHelp');
  }

  getLatestHelp(): Observable<HelpRequest> {
    // 方法一：如果後端有提供獲取最新資料的 API
    return this.http.get<HelpRequest>(`${this.apiUrl}latest`);
  }

  getHelpById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  addHelp(help: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, help);
  }

  updateHelp(id: number, help: any): Observable<void> {
    return this.http.put<void>(`${'https://localhost:7012/api/Helps'}/${id}`, help);
  }

  deleteHelp(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getDistrictClasses(): Observable<any[]> {
    return this.http.get<any[]>('https://localhost:7012/api/Datas/districts');
  }
  getHelpClasses(): Observable<any[]> {
    return this.http.get<any[]>('https://localhost:7012/api/Datas/helpclasses');
  }
  setFormData(data: any) {
    this.formData = data;
  }

  getFormData() {
    return this.formData;
  }

  clearFormData() {
    this.formData = null;
  }
  getDistrictName(districtId: number): string {
    const districtMap: { [key: number]: string } = {
      1: '中正區',
      2: '大同區',
      3: '中山區',
      4: '松山區',
      5: '大安區',
      6: '萬華區',
      7: '信義區',
      8: '士林區',
      9: '北投區',
      10: '內湖區',
      11: '南港區',
      12: '文山區'
    };
    return districtMap[districtId] || '未知區域';
  }

   // 轉換幫助類別編號為名稱
   getHelpClassName(helpClass: number): string {
    const helpClassMap: { [key: number]: string } = {
      1: '技術類',
      2: '生活類',
      3: '勞力類',
      4: '腦力類',
      5: '教育類'
    };
    return helpClassMap[helpClass] || '其他類別';
  }

  updateHelpStatus(id: number): Observable<void> {
    console.log(`準備更新狀態，helpId: ${id}`);

    return this.http.put<void>(`${this.apiUrl}updateHelpStatus/${id}`, null)
      .pipe(
        tap(() => console.log('狀態更新成功')),
        catchError(error => {
          console.error('狀態更新失敗:', error);
          return throwError(() => error);
        })
      );
  }

  updateHelpStatus1(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}UpdateHelpStatus1/${id}`, null);
  }


  getHelpByClass(helpClass: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}getHelpByClass/${helpClass}`);
  }
}

