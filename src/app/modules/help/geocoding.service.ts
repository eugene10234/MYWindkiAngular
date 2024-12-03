import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface GeocodeResponse {
  latitude: number;
  longitude: number;

}

export interface GpsCoordinate {
  fLatitude: number | null;
  fLongitude: number | null;
}
export interface HelpDTO{
  latitude: number;
  longitude: number;
  districtId: number;
  helpClass: number;
  name: string;
  createTime: Date;
  helpContent?: string;
  points: number;
  helpId: number;

}
latitude: 0;
longitude: 0;

@Injectable({
  providedIn: 'root'

})


export class GeocodingService {

  private backendUrl = 'https://localhost:7012/api/Geocoding/get-coordinates'; // 替換為你的後端 URL
  private backendUrlForHelpId = 'https://localhost:7012/api/Geocoding/getCoordinatesByHelpClassId'; // 替換為你的後端 URL

  constructor(private http: HttpClient) { }

  // 將地址編譯成經緯度的方式
  getCoordinates(address: string): Observable<any> {
    const url = `${this.backendUrl}?address=${encodeURIComponent(address)}`;
    return this.http.get<any>(url);
  }

  // 將 helpclass 傳回後端的 API 調用
  getCoordinatesByHelpClassId(helpClassId: number): Observable<HelpDTO[]> {
    const url = `${this.backendUrlForHelpId}?helpClassId=${helpClassId}`; // 替換為您的後端 API URL
    return this.http.get<HelpDTO[]>(url);
}

}
