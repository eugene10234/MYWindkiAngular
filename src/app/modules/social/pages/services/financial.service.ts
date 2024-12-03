import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { NewsItem, StockItem } from '../interfaces/financial.interface';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FinancialService {
  private readonly API_KEY = environment.alphavantage.apiKey;
  private readonly BASE_URL = environment.alphavantage.baseUrl;

  constructor(private http: HttpClient) {}

  getStockQuote(symbol: string): Observable<StockItem> {
    return this.http
      .get<any>(
        `${this.BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.API_KEY}`
      )
      .pipe(
        map((response) => this.transformStockData(response['Global Quote']))
      );
  }

  getMultipleStocks(symbols: string[]): Observable<StockItem[]> {
    const requests = symbols.map((symbol) => this.getStockQuote(symbol));
    return forkJoin(requests);
  }

  getMarketNews(): Observable<{ news: NewsItem[] }> {
    return this.http
      .get<any>(
        `${this.BASE_URL}?function=NEWS_SENTIMENT&apikey=${this.API_KEY}`
      )
      .pipe(
        map((response) => ({
          news: (response.feed || []).map(this.transformNewsData),
        }))
      );
  }

  private transformStockData(data: any): StockItem {
    return {
      symbol: data['01. symbol'] || '',
      shortName: data['01. symbol'] || '',
      regularMarketPrice: parseFloat(data['05. price']) || 0,
      regularMarketChange: parseFloat(data['09. change']) || 0,
      regularMarketChangePercent:
        parseFloat(data['10. change percent'].replace('%', '')) || 0,
      regularMarketTime: new Date(),
      marketState: 'REGULAR',
    };
  }

  private transformNewsData(data: any): NewsItem {
    return {
      title: data.title,
      link: data.url,
      publisher: data.source,
      providerPublishTime: new Date(data.time_published).getTime() / 1000,
      type: 'STORY',
      thumbnail: data.banner_image
        ? {
            resolutions: [
              {
                url: data.banner_image,
                width: 640,
                height: 360,
              },
            ],
          }
        : undefined,
    };
  }
}
