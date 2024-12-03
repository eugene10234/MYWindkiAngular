import { Injectable ,NgZone} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { MarketIndex } from '../Models/market-index.model';
import { environment } from 'src/environments/environment';
import { Candles } from '../Models/candles.model';

@Injectable({
  providedIn: 'root'
})
export class MarketIndexService {
  private socket: WebSocket | null = null;
  private marketIndexSubject = new Subject<MarketIndex>();
  private candlesSubject = new Subject<Candles>();

  constructor(private ngZone: NgZone) {}

  /**
   * 建立 WebSocket 連線並進行身份驗證
   */
  connect(): void {
    const url = environment.fugleMarket.fugleApiBase;
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      // 發送身份驗證請求
      this.socket!.send(
        JSON.stringify({
          event: 'auth',
          data: { apikey: environment.fugleMarket.apiKey },
        })
      );
    };

    this.socket.onmessage = (event) => {
      console.log('D1',event);
      const message = JSON.parse(event.data);

      this.ngZone.run(() => {
        // 處理身份驗證成功
        if (message.event === 'authenticated') {
          this.subscribeToIndices();
          // this.subscribeToCandles();
        }

        // 處理指數行情數據
        if (message.event === 'snapshot' || (message.event === 'data' && message.channel === 'indices')) {

          console.log('D2',message.data)
          console.log('D2 change',message.data as MarketIndex)
          this.marketIndexSubject.next(message.data as MarketIndex);
        }

        // 處理 K 線數據
        // if (message.event === 'data' && message.channel === 'candles') {
        //   console.log('接收到 K 線數據:', message.data);
        //   this.candlesSubject.next(message.data as Candles);
        // }

        // 處理心跳訊息
        if (message.event === 'heartbeat') {
          console.log('收到心跳訊息:', message.data.time);
        }

        // 處理 Pong 訊息
        if (message.event === 'pong') {
          console.log('收到 Pong:', message.data);
        }
      });
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket 發生錯誤:', error);
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket 已關閉:', event.reason || '無原因');
    };

    // 啟動心跳機制
    this.startHeartbeat();
  }

  /**
   * 訂閱指數頻道
   */
  private subscribeToIndices(): void {
    if (this.socket) {
      this.socket.send(
        JSON.stringify({
          event: 'subscribe',
          data: {
            channel: 'indices',
            symbol: 'IR0001', // 台股加權指數
          },
        })
      );
      console.log('已訂閱台股指數行情');
    }
  }

  /**
   * 訂閱 K 線頻道
   */
  private subscribeToCandles(): void {
    if (this.socket) {
      this.socket.send(
        JSON.stringify({
          event: 'subscribe',
          data: {
            channel: 'candles',
            symbol: 'IR0001', // 股票代碼 (如台積電)
          },
        })
      );
      console.log('已訂閱 K 線行情');
    }
  }

  /**
   * 提供可觀察的 MarketIndex 數據
   */
  getMarketIndex(): Observable<MarketIndex> {
    return this.marketIndexSubject.asObservable();
  }

  /**
   * 提供可觀察的 Candles 數據
   */
  getCandles(): Observable<Candles> {
    return this.candlesSubject.asObservable();
  }

  /**
   * 發送 Ping 保持 WebSocket 連線
   */
  private startHeartbeat(): void {
    setInterval(() => {
      if (this.socket) {
        this.socket.send(JSON.stringify({ event: 'ping' }));
        console.log('已發送 Ping 保持連線');
      }
    }, 30000); // 每 30 秒發送一次 Ping
  }

  /**
   * 斷開 WebSocket 連線
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      console.log('WebSocket 已斷開');
    }
  }
}
