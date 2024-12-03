import { Component, OnInit } from '@angular/core';

interface TransactionRecord {
  id: number;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date: string;
}

@Component({
  selector: 'app-credit',
  templateUrl: './credit.component.html',
  styleUrls: ['./credit.component.css']
})
export class CreditComponent implements OnInit {
  creditBalance: number = 0;
  transactionHistory: TransactionRecord[] = [];

  constructor() { }

  ngOnInit(): void {
    this.loadCreditInfo();
  }

  loadCreditInfo() {
    // 模擬從API獲取資料
    this.creditBalance = 1000;
    this.transactionHistory = [
      {
        id: 1,
        type: 'income',
        amount: 500,
        description: '購買點數',
        date: '2024-03-15 14:30:00'
      },
      {
        id: 2,
        type: 'expense',
        amount: 100,
        description: '轉讓給用戶 John',
        date: '2024-03-14 09:15:00'
      }
    ];
  }

  showPurchaseDialog() {
    // 實作購買點數對話框邏輯
    console.log('開啟購買點數對話框');
  }

  showTransferDialog() {
    // 實作轉讓點數對話框邏輯
    console.log('開啟轉讓點數對話框');
  }
}
