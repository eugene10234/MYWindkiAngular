import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


export interface HelperRequest {
  name: string;
  email: string;


}
export interface MatchDTO {
  helperName: string;
  helperEmail: string;
  points: number;
  helpName: string;
  districtId: number;
  helpContent: string;
  helpClass: number;
  helpStatus: number;
  latitude: number;
  longitude: number;
  helpPhone: string;
  matchDate: string;
  helpId:number;
}

export interface UpdateMatch {
helpContent:string;
grade:number;
helpId:number;
}

@Injectable({
  providedIn: 'root'
})


export class HelperService {

  private helperData: any = {};
  constructor(private http: HttpClient,

  ) { }

  setHelperData(data: any) {
    this.helperData = data;
  }

  getHelperData() {
    return this.helperData;
  }

  sendMatchData(data: any): Observable<any> {
    const url = 'https://localhost:7012/api/Helps/match'; // 替換為你的後端 API 地址
    return this.http.post(url, data);
  }

  getLatestMatch(): Observable<MatchDTO> {
    // 方法一：如果後端有提供獲取最新資料的 API
    return this.http.get<MatchDTO>(`https://localhost:7012/api/Helps/getlatestMatch`);
  }

  getAllMatch(): Observable<MatchDTO[]> {
    return this.http.get<MatchDTO[]>(`https://localhost:7012/api/Matchs/allmatch`);
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
  UpdateMatchContent(updateMatch: UpdateMatch): Observable<UpdateMatch> {
    return this.http.put<UpdateMatch>(`https://localhost:7012/api/Helps/updatematchcontent`, updateMatch);
  }
  getMatchByClass(helpClass: number): Observable<any> {
    return this.http.get<any>(`https://localhost:7012/api/Matchs/getmatchbyclass/${helpClass}`);
  }

}
