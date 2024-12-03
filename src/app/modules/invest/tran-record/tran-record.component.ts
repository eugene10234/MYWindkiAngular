import { TTranRecordService } from './../servies/ttran-record.service';
import { Component,OnInit } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { TranRecord } from '../Models/tran-record.model';


@Component({
  selector: 'app-tran-record',
  templateUrl: './tran-record.component.html',
  styleUrls: ['./tran-record.component.css']
})
export class TranRecordComponent {

  transactions: TranRecord[] = []; // 存放交易資料
  fmemberId: string = 'M0000000003'; // 篩選的會員編號

  constructor(private tranRecordService: TTranRecordService) {}

  ngOnInit(): void {
    this.loadTransactionsByMemberId();
  }

  // 加載特定會員的交易資料
  loadTransactionsByMemberId(): void {
    this.tranRecordService.getTransactionsByMemberId(this.fmemberId).subscribe(
      data => {
        this.transactions = data; // 綁定到模板
      },
      error => {
        console.error('無法加載交易紀錄:', error);
      }
    );
  }
}
