import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HelpService, HelpRequest } from '../../help.service';
import { ActivatedRoute } from '@angular/router';
import { HelperService, MatchDTO, UpdateMatch } from '../../helper.service';
import { LoginService } from 'src/app/login-helper/services/login.service';
import { ChatgptService } from '../../services/chatgpt.service';


@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.css']
})
export class ManagementComponent implements OnInit, AfterViewInit {
  showRatingModal = false;
  currentRating = 0;
  ratingComment = '';
  currentContent: string = 'match'; // 默認顯示媒合區
  requestRecords: HelpRequest[] = [];
  loading: boolean = true;
  error: string = '';
  matchRecords: MatchDTO[] = [];
  UpdateMatchRecord: UpdateMatch[] = [];
  currentHelpId = 0;
  selectedClass: number | null = null;
  showChat: boolean = false;  // 控制聊天室顯示/隱藏

  // 聊天屬性
  userMessage = '';
  response = '';

  constructor(
    public helpService: HelpService,
    private route: ActivatedRoute,
    public helperService: HelperService,
    private loginService: LoginService,
    private chatgptService: ChatgptService  // 注入 ChatGPT 服務
  ) { }


  ngOnInit(): void {
    // 檢查 URL 中是否有指定要顯示的內容
    const urlParams = new URLSearchParams(window.location.search);
    const content = urlParams.get('content');
    if (content) {
      this.currentContent = content;
    }
    // 載入求助紀錄
    this.loadHelpRequest();
    // 載入媒合紀錄
    this.loadMatchRequest();  // 添加這行

    // 添加除錯訊息
    console.log('currentContent:', this.currentContent);

  }
  ngAfterViewInit() {
    // 等待 DOM 完全載入後執行動畫
    setTimeout(() => {
      this.initializeProgressBars();
    }, 100);
  }



  private initializeProgressBars() {
    // 獲取所有進度條元素
    const progressFills = document.querySelectorAll('.progress-fill');

    progressFills.forEach(fill => {
      const element = fill as HTMLElement;
      const targetWidth = element.style.width;
      // 設置 CSS 變數
      element.style.setProperty('--target-width', targetWidth);
      // 重置寬度為 0
      element.style.width = '0';
      // 添加動畫類別
      element.classList.add('animate');
    });
  }
  // 切換內容的方法
  switchContent(content: string, event: Event): void {
    event.preventDefault(); // 防止頁面刷新
    if (content === 'chat') {
      // 點擊 AI聊天室 時切換顯示狀態
      this.showChat = !this.showChat;
    } else {
      this.currentContent = content;
    }

    // 更新側邊欄選中狀態
    const allLinks = document.querySelectorAll('.sidebar ul li a') as NodeListOf<HTMLAnchorElement>;
    allLinks.forEach(link => {
      link.style.backgroundColor = 'transparent';
      link.style.padding = '0';
      link.style.borderRadius = '0';
    });

    // 設置當前選中項的樣式
    const currentLink = (event.target as HTMLElement);
    currentLink.style.backgroundColor = '#0f3460';
    currentLink.style.padding = '10px';
    currentLink.style.borderRadius = '5px';
  }

  // 排序方法
  sortRecords(order: 'asc' | 'desc' = 'desc', recordType: 'request' | 'match' = 'request') {
    if (recordType === 'request') {
      this.requestRecords.sort((a, b) => {
        const dateA = new Date(a.createTime || 0);
        const dateB = new Date(b.createTime || 0);
        return order === 'desc'
          ? dateB.getTime() - dateA.getTime()  // 新到舊
          : dateA.getTime() - dateB.getTime(); // 舊到新
      });
    } else if (recordType === 'match') {
      this.matchRecords.sort((a, b) => {
        const dateA = new Date(a.matchDate || 0);
        const dateB = new Date(b.matchDate || 0);
        return order === 'desc'
          ? dateB.getTime() - dateA.getTime()  // 新到舊
          : dateA.getTime() - dateB.getTime(); // 舊到新
      });
    }
  }

  // 載入求助紀錄
  private loadHelpRequest() {
    this.loading = true;
    this.helpService.getAllHelps().subscribe({
      next: (records) => {
        console.log('成功獲取資料:', records); // 添加日誌
        this.requestRecords = records;
        this.sortRecords('desc'); // 預設排序為新到舊
        this.loading = false;
        // 添加更多除錯資訊
        console.log('記錄數量:', this.requestRecords.length);
        console.log('當前顯示內容:', this.currentContent);
      },
      error: (error) => {
        console.error('獲取求助紀錄失敗:', error);
        // 更詳細的錯誤訊息
        this.error = `載入資料失敗: ${error.message || '未知錯誤'}`;
        if (error.status === 0) {
          this.error = '無法連接到伺服器，請確認後端服務是否啟動';
        } else if (error.status === 404) {
          this.error = 'API 路徑不存在';
        } else if (error.status === 500) {
          this.error = '伺服器內部錯誤';
        }
        this.loading = false;
        this.error = ''; // 清空錯誤訊息
      }
    });
  }

  // 載入媒合紀錄
  private loadMatchRequest() {
    this.loading = true;
    this.helperService.getAllMatch().subscribe({
      next: (records) => {
        console.log('成功獲取資料:', records); // 添加日誌
        this.matchRecords = records;
        this.sortRecords('desc'); // 預設排序為新到舊
        this.loading = false;
        // 添加更多除錯資訊
        console.log('記錄數量:', this.matchRecords.length);
        console.log('當前顯示內容:', this.currentContent);
      },
      error: (error) => {
        console.error('獲取求助紀錄失敗:', error);
        // 更詳細的錯誤訊息
        this.error = `載入資料失敗: ${error.message || '未知錯誤'}`;
        if (error.status === 0) {
          this.error = '無法連接到伺服器，請確認後端服務是否啟動';
        } else if (error.status === 404) {
          this.error = 'API 路徑不存在';
        } else if (error.status === 500) {
          this.error = '伺服器內部錯誤';
        }
        this.loading = false;
      }
    });
  }

  getProgressWidth(status: number): string {
    switch (status) {
      case 1: return '25%';
      case 2: return '50%';
      case 3: return '75%';
      case 4: return '100%';
      default: return '0%';
    }
  }





  // completeRequest1(helpId: number) {
  //   console.log('開始更新狀態，helpId:', helpId); // 添加日誌
  //   // 檢查 helpId 是否有效
  //   if (!helpId) {
  //     console.error('無效的 helpId');
  //     return;
  //   }

  //   // 找到對應的請求記錄
  //   const request = this.requestRecords.find(r => r.helpId === helpId);
  //   console.log('當前請求記錄:', request); // 添加日誌
  //   // 檢查是否找到記錄
  //   if (!request) {
  //     console.error('找不到對應的請求記錄');
  //     return;
  //   }
  //   console.log('當前狀態:', request.status);
  //   // 檢查狀態是否允許更新
  //   if (![2, 3].includes(request.status)) {
  //     console.error('當前狀態不允許更新');
  //     return;
  //   }

  //   // this.loading = true;
  //   this.error = ''; // 清空錯誤訊息
  //   this.helpService.updateHelpStatus(helpId)
  //     .subscribe({
  //       next: (response) => {
  //         console.log('更新成功:=================', response);
  //         var aaa = this.requestRecords.filter(e => e.helpId == helpId)[0];
  //         // this.requestRecords.filter(e => e.helpId == helpId)[0].status += 1;
  //         console.log(response);
  //         console.log(aaa);
  //         console.log('更新成功:=================', response);

  //         // 先更新本地狀態
  //         // const updatedRequest = this.requestRecords.find(r => r.helpId === helpId);
  //         // if (updatedRequest) {
  //         //   updatedRequest.status = updatedRequest.status + 1;
  //         //   console.log('更新後的狀態:', updatedRequest.status);
  //         // }

  //         // 延遲一下再重新載入資料，確保後端資料已更新
  //         // this.loadHelpRequest();
  //         // this.loadMatchRequest();
  //       },
  //       error: (error) => {
  //         console.error('更新狀態失敗:', error);
  //         this.error = `更新狀態失敗: ${error.message || '未知錯誤'}`;
  //         if (error.status === 404) {
  //           this.error = '找不到對應的請求記錄';
  //         } else if (error.status === 400) {
  //           this.error = '無效的狀態更新請求';
  //         }
  //       },
  //       complete: () => {
  //         this.loading = false;
  //       }
  //     });
  // }



  completeRequest(helpId: number) {
    // 檢查 helpId 是否有效
    if (!helpId) {
      return;
    }
    // 找到對應的請求記錄
    const request = this.requestRecords.find(r => r.helpId === helpId);
    // 檢查是否找到記錄
    if (!request) {
      return;
    }
    // 檢查狀態是否允許更新
    if (![2].includes(request.status)) {
      return;
    }
    this.loading = true;
    this.error = ''; // 清空錯誤訊息
    this.helpService.updateHelpStatus(helpId)
      .subscribe({
        next: (response) => {
          console.log('更新成功:=================', response);
          var aaa = this.requestRecords.filter(e => e.helpId == helpId)[0];
          // this.requestRecords.filter(e => e.helpId == helpId)[0].status += 1;

          // 先更新本地狀態
          const updatedRequest = this.requestRecords.find(r => r.helpId === helpId);
          if (updatedRequest) {
            updatedRequest.status = updatedRequest.status + 1;
            console.log('更新後的狀態:', updatedRequest.status);
          }
          this.loading = false;

          // 延遲一下再重新載入資料，確保後端資料已更新
          // this.loadHelpRequest();
          // this.loadMatchRequest();
        },
        error: (error) => {
          console.error('更新狀態失敗:', error);
          this.error = `更新狀態失敗: ${error.message || '未知錯誤'}`;
          if (error.status === 404) {
            this.error = '找不到對應的請求記錄';
          } else if (error.status === 400) {
            this.error = '無效的狀態更新請求';
          }
          this.loading = false;
        }
      });
  }
  //取消請求
  cancelRequest() {


  }





  // rateRequest(helpId: number) {
  //   // 檢查 helpId 是否有效
  //   if (!helpId) {
  //     return;
  //   }
  //   // 找到對應的請求記錄
  //   const request = this.requestRecords.find(r => r.helpId === helpId);
  //   // 檢查是否找到記錄
  //   if (!request) {
  //     return;
  //   }
  //   // 檢查狀態是否允許更新
  //   if (![3].includes(request.status)) {
  //     return;
  //   }
  //   this.loading = true;
  //   this.error = ''; // 清空錯誤訊息
  //   this.helpService.updateHelpStatus1(helpId)
  //     .subscribe({
  //       next: (response) => {
  //         console.log('更新成功:=================', response);
  //         var aaa = this.requestRecords.filter(e => e.helpId == helpId)[0];
  //         // this.requestRecords.filter(e => e.helpId == helpId)[0].status += 1;

  //         // 先更新本地狀態
  //         const updatedRequest = this.requestRecords.find(r => r.helpId === helpId);
  //         if (updatedRequest) {
  //           updatedRequest.status = updatedRequest.status + 1;
  //           console.log('更新後的狀態:', updatedRequest.status);
  //         }
  //         this.loading = false;

  //         // 延遲一下再重新載入資料，確保後端資料已更新
  //         // this.loadHelpRequest();
  //         // this.loadMatchRequest();
  //       },
  //       error: (error) => {
  //         console.error('更新狀態失敗:', error);
  //         this.error = `更新狀態失敗: ${error.message || '未知錯誤'}`;
  //         if (error.status === 404) {
  //           this.error = '找不到對應的請求記錄';
  //         } else if (error.status === 400) {
  //           this.error = '無效的狀態更新請求';
  //         }
  //         this.loading = false;
  //       }
  //     });



  // }


  // 顯示評價彈出框
  rateRequest(records: HelpRequest[], helpId: number) {
    console.log('評價彈出框開啟');
    this.showRatingModal = true;
    this.currentRating = 0;
    this.ratingComment = '';
    this.currentHelpId = helpId;
    this.requestRecords = records;
  }

  // 關閉評價彈出框
  closeRatingModal() {
    this.showRatingModal = false;
    this.currentHelpId = 0;

  }

  // 評分邏輯
  rate(star: number) {
    this.currentRating = star;
    console.log('當前評分:', this.currentRating);
  }

  // 確認送出評價
  submitRating() {
    // 檢查 helpId 是否有效
    if (this.currentHelpId != null) {
      // 找到對應的請求記錄
      const request = this.requestRecords.find(r => r.helpId === this.currentHelpId);
      // 檢查是否找到記錄
      if (!request) {
        return;
      }
      // 檢查狀態是否允許更新
      if (![3].includes(request.status)) {
        return;
      }
    }
    this.loading = true;
    this.error = ''; // 清空錯誤訊息
    this.helpService.updateHelpStatus1(this.currentHelpId).subscribe({
      next: (response) => {
        console.log('更新成功:=================', response);
        var aaa = this.requestRecords.filter(e => e.helpId == this.currentHelpId)[0];
        // 先更新本地狀態
        const updatedRequest = this.requestRecords.find(r => r.helpId === this.currentHelpId);
        if (updatedRequest) {
          updatedRequest.status = updatedRequest.status + 1;
          console.log('更新後的狀態:', updatedRequest.status);
        }
        // 延遲一下再重新載入資料，確保後端資料已更新
        this.loadHelpRequest();
        // this.loadMatchRequest();
      },
      error: (error) => {
        console.error('更新狀態失敗:', error);
        this.error = `更新狀態失敗: ${error.message || '未知錯誤'}`;
        if (error.status === 404) {
          this.error = '找不到對應的請求記錄';
        } else if (error.status === 400) {
          this.error = '無效的狀態更新請求';
        }
        this.loading = false;
      }
    });

    //update match
    const updateMatch: UpdateMatch = {
      helpContent: this.ratingComment,
      grade: this.currentRating,
      helpId: this.currentHelpId
    };
    this.helperService.UpdateMatchContent(updateMatch).subscribe({
      next: (response) => {
        console.log('更新成功:=================', response);
        console.log('評分:', this.currentRating);
        console.log('評語:', this.ratingComment);
        // 可以在這裡調用服務來將評價傳送到後端 API
        this.closeRatingModal();
      },
      error: (error) => {
        console.error('更新匹配內容失敗:', error);
        this.error = `更新匹配內容失敗: ${error.message || '未知錯誤'}`;
        this.loading = false;
      }

    });
    this.closeRatingModal();

  }



  filterByClass(helpClass: number) {
    if (this.selectedClass === helpClass) {
      // 如果點擊的是當前選中的類別，則取消篩選
      this.selectedClass = null;

    } else {
      // 否則進行篩選
      this.selectedClass = helpClass;

      this.helpService.getHelpByClass(helpClass).subscribe(data => {
        this.requestRecords = data;
      });
      this.helperService.getMatchByClass(helpClass).subscribe(data => {
        this.matchRecords = data;
      });
      this.requestRecords = this.requestRecords.filter(
        record => record.helpClass === helpClass
      );
      this.matchRecords = this.matchRecords.filter(
        record => record.helpClass === helpClass
      );
    }
  }

 // 加入發送gpt訊息的方法
 sendMessage() {
  if (!this.userMessage.trim()) {
    return;
  }

  this.loading = true;
  this.error = '';

  this.chatgptService.chat(this.userMessage)
    .subscribe({
      next: (response) => {
        console.log('API 回應:', response);

        // 檢查並提取回應內容
        if (response.choices && response.choices.length > 0) {
          this.response = response.choices[0].message.content;
        } else {
          this.error = '無法獲取 AI 回應';
        }

        // 可以添加使用量統計（選擇性）
        console.log('Token 使用量:', {
          prompt: response.usage.prompt_tokens,
          completion: response.usage.completion_tokens,
          total: response.usage.total_tokens
        });

        this.loading = false;
      },
      error: (err) => {
        console.error('錯誤詳情:', err);

        // 錯誤處理
        if (err.status === 0) {
          this.error = '無法連接到伺服器';
        } else if (err.status === 500) {
          this.error = '伺服器內部錯誤';
        } else {
          this.error = err.error?.message || '發送訊息時發生錯誤';
        }

        this.loading = false;
      }
    });
    this.userMessage = '';
}

 // 關閉聊天室
 closeChat() {
  this.showChat = false;
}

}
