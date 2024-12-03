import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection!: signalR.HubConnection;

  constructor() {
    this.createConnection();
  }

  private createConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.backend.apiUrl}/chatHub`, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
        withCredentials: true
      })
      .configureLogging(signalR.LogLevel.Debug)
      .build();
  }

  public startConnection() {
    return this.hubConnection
      .start()
      .then(() => {
        console.log('連接成功');
      })
      .catch(err => {
        console.error('連接失敗:', err);
        return Promise.reject(err);
      });
  }
} 
