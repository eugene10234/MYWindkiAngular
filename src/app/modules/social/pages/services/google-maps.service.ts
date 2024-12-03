import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { environment } from '../../../../../environments/environment';

// 定義簡單的介面
interface GeocoderResult {
  formatted_address: string;
  // 可以根據需要添加其他屬性
}

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {
  private readonly apiKey = environment.googleMaps.apiKey;
  private isLoaded = false;

  constructor(@Inject(DOCUMENT) private document: Document) {}

  async loadGoogleMapsApi(): Promise<void> {
    if (this.isLoaded) {
      return;
    }

    // 使用 Angular 的 Renderer2 或 DOCUMENT token
    const script = this.document.createElement('script');
    script.type = 'text/javascript';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}`;

    const promise = new Promise<void>((resolve, reject) => {
      script.onload = () => {
        this.isLoaded = true;
        resolve();
      };
      script.onerror = () => {
        reject(new Error('Google Maps API 載入失敗'));
      };
    });

    this.document.body.appendChild(script);
    return promise;
  }

  async getAddressFromCoordinates(lat: number, lng: number): Promise<string> {
    if (!this.isLoaded) {
      await this.loadGoogleMapsApi();
    }

    return new Promise((resolve, reject) => {
      // 使用 any 類型來避免類型檢查問題
      const maps = (window as any).google.maps;
      const geocoder = new maps.Geocoder();
      const latlng = { lat, lng };

      geocoder.geocode(
        { location: latlng },
        (results: GeocoderResult[], status: string) => {
          if (status === 'OK' && results?.[0]) {
            resolve(results[0].formatted_address);
          } else {
            reject(new Error('無法獲取地址'));
          }
        }
      );
    });
  }
}
