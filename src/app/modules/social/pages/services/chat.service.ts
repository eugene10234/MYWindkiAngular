import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { Message } from '../interfaces/message.interface';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = `${environment.backend.apiUrl}/api/Chat`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwt');
    if (!token) {
      throw new Error('No token found');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  private getMemberAvatar(memberId: string): string {
    return `https://api.dicebear.com/7.x/lorelei/svg?seed=${memberId}&backgroundColor=ffdfbf,ffd5dc,c0aede,b6e3f4&mood=happy,blissful&size=128`;
  }

  public sendMessage(receiverId: string, content: string): Observable<Message> {
    const headers = this.getHeaders();
    return this.http.post<Message>(`${this.apiUrl}/send`, {
      receiverId,
      content
    }, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  public getChatHistory(memberId: string): Observable<Message[]> {
    if (!memberId) {
      return of([]);
    }

    const headers = this.getHeaders();
    return this.http.get<any>(`${this.apiUrl}/history/${memberId}`, { headers }).pipe(
      map(response => this.mapMessages(response.messages)),
      catchError(this.handleError)
    );
  }

  private mapMessages(messages: any[]): Message[] {
    return messages.map(msg => ({
      FMessId: msg.fMessId || msg.FMessId,
      FMemberId: msg.fMemberId || msg.FMemberId,
      FSId: msg.fSId || msg.FSId || msg.fMemberId || msg.FMemberId,
      FRId: msg.fRId || msg.FRId,
      FMessContent: msg.fMessContent || msg.FMessContent,
      FTimestamp: new Date(msg.fTimestamp || msg.FTimestamp),
      FCreateTime: new Date(msg.fCreateTime || msg.FCreateTime),
      FMessType: msg.fMessType || msg.FMessType || 'TEXT',
      FIsRead: msg.fIsRead || msg.FIsRead || false,
      FImageName: msg.fImageName || msg.FImageName,
      FImagePath: msg.fImagePath || msg.FImagePath,
      userAvatar: this.getMemberAvatar(msg.fMemberId || msg.FMemberId)
    }));
  }

  private handleError(error: any): Observable<never> {
    console.error('API 錯誤:', error);
    return throwError(() => error);
  }

  public getChatList(memberId: string): Observable<any[]> {
    const headers = this.getHeaders();
    return this.http.get<any[]>(`${this.apiUrl}/list/${memberId}`, { headers }).pipe(
      map(chats => chats.map(chat => ({
        ...chat,
        avatar: this.getMemberAvatar(chat.FMemberId || chat.id)
      })))
    );
  }
}
