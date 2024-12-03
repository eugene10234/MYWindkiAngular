import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Message } from '../interfaces/message.interface';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: HubConnection | null = null;
  private messageSubject = new BehaviorSubject<Message | null>(null);
  public messageReceived = this.messageSubject.asObservable();

  public initializeConnection(): Promise<void> {
    const token = localStorage.getItem('jwt');
    if (!token) {
      return Promise.reject('Token not found');
    }

    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${environment.backend.apiUrl}/chatHub`, {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.on('ReceiveMessage', (message: Message) => {
      console.log('收到新訊息:', message);
      this.messageSubject.next(message);
    });

    return this.hubConnection.start();
  }

  public async sendMessage(receiverId: string, message: string): Promise<void> {
    if (!this.hubConnection) {
      throw new Error('Connection not initialized');
    }

    try {
      await this.hubConnection.invoke('SendMessage', receiverId, message);
    } catch (error) {
      console.error('發送訊息失敗:', error);
      throw error;
    }
  }

  public disconnect(): Promise<void> {
    return this.hubConnection?.stop() ?? Promise.resolve();
  }
}
