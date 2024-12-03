import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';

import { ChatService } from '../services/chat.service';
import { SignalRService } from '../services/signalr.service';
import { Message } from '../interfaces/message.interface';
import { Router } from '@angular/router';
import { EMPTY, filter, switchMap, tap, BehaviorSubject, catchError, takeUntil, Subject } from 'rxjs';
import { AuthService } from 'src/app/login-helper/services/auth.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
  chatList: any[] = [];
  selectedChat: any = null;
  currentUserId: string = '';
  isLoading = false;
  newMessage: string = '';
  private destroy$ = new Subject<void>();
  private readonly demoMessages: string[] = [
    '最近市場波動較大，建議保持觀望',
    '你覺得現在是進場好時機嗎？',
    '這支股票的技術面看起來不錯',
    '今天大盤表現如何？',
    '你對這個產業的看法如何？',
    '最近有注意到哪些投資機會？',
    '這檔股票的基本面如何？',
    '要注意市場風險',
    '建議做好資金配置',
    '關注一下國際情勢發展'
  ];

  constructor(
    private signalRService: SignalRService,
    private chatService: ChatService,
    private authService: AuthService,
    private cd: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  ngOnInit() {
    this.authService.getUserId().pipe(
      takeUntil(this.destroy$)
    ).subscribe(userId => {
      if (userId) {
        this.currentUserId = userId;
        this.initializeSignalR();
        this.loadChatList(userId);
      }
    });
  }

  private initializeSignalR() {
    this.signalRService.initializeConnection().then(() => {
      this.signalRService.messageReceived
        .pipe(takeUntil(this.destroy$))
        .subscribe(message => {
          if (message) {
            console.log('SignalR 收到新訊息:', message);
            this.zone.run(() => {
              this.handleReceivedMessage(message);
            });
          }
        });
    });
  }

  private handleReceivedMessage(message: any) {
    console.log('處理新訊息:', message, '當前選中的聊天:', this.selectedChat);

    const isSender = message.fMemberId === this.currentUserId;
    const isReceiver = message.fRid === this.currentUserId;
    const isCurrentChat = this.selectedChat &&
      (this.selectedChat.id === message.fRid || this.selectedChat.id === message.fSid);

    if (isCurrentChat || isSender || isReceiver) {
      const newMessage: Message = {
        FMessId: message.fMessId,
        FMemberId: message.fMemberId,
        FSId: message.fSid,
        FRId: message.fRid,
        FMessContent: message.fMessContent,
        FCreateTime: new Date(message.fCreateTime),
        FTimestamp: new Date(message.fTimestamp),
        FMessType: message.fMessType,
        FIsRead: message.fIsRead,
        FImageName: message.fImageName,
        FImagePath: message.fImagePath
      };

      const messageExists = this.messages.some(m => m.FMessId === newMessage.FMessId);

      if (!messageExists) {
        console.log('添加新訊息到列表');
        this.messages = [...this.messages, newMessage];
        this.messages.sort((a, b) =>
          new Date(a.FCreateTime).getTime() - new Date(b.FCreateTime).getTime()
        );
        this.cd.detectChanges();
      }
    }

    this.loadChatList(this.currentUserId);
  }

  sendMessage() {
    if (!this.newMessage?.trim() || !this.selectedChat) {
      return;
    }

    this.isLoading = true;
    const content = this.newMessage.trim();
    this.newMessage = '';

    this.signalRService.sendMessage(this.selectedChat.id, content)
      .then(() => {
        console.log('訊息發送成功');
        this.isLoading = false;
      })
      .catch(error => {
        console.error('發送訊息失敗:', error);
        this.isLoading = false;
      });
  }

  private loadChatList(userId: string) {
    if (!userId) return;

    this.chatService.getChatList(userId).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (chats) => {
        this.zone.run(() => {
          this.chatList = chats;
          if (this.chatList.length > 0 && !this.selectedChat) {
            this.selectChat(this.chatList[0]);
          }
          this.cd.detectChanges();
        });
      },
      error: (error) => console.error('載入聊天列表失敗:', error)
    });
  }

  selectChat(chat: any) {
    this.selectedChat = chat;
    if (chat) {
      this.chatService.getChatHistory(chat.id).subscribe(messages => {
        this.zone.run(() => {
          this.messages = messages;
          this.cd.detectChanges();
        });
      });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  sendRandomMessage(): void {
    const randomIndex = Math.floor(Math.random() * this.demoMessages.length);
    this.newMessage = this.demoMessages[randomIndex];
  }
}
