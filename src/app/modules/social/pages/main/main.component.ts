import { Component, OnInit, HostListener } from '@angular/core';
import { FinancialService } from '../services/financial.service';
import { SocialService } from '../../services/social.service';
import { ISocialPost, BackendCommentDTO, isValidComment, isValidSocialPost } from '../../models/social.interface';
import { NewsItem, StockItem } from '../interfaces/financial.interface';
import { forkJoin } from 'rxjs';
import { GoogleMapsService } from '../services/google-maps.service';
import { AuthService } from '../../../../login-helper/services/auth.service';
import { take } from 'rxjs/operators';

interface PostWithImage extends ISocialPost {
  selectedImage?: string | null;
}

interface IMemberResponse {
  fMemberId: string;
  fUserName: string;
  fPostContent: string;
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  providers: [FinancialService],
})
export class MainComponent implements OnInit {
  posts: PostWithImage[] = [];
  newPostContent: string = '';
  stockData: StockItem[] = [];
  newsData: NewsItem[] = [];
  isLoading = false;
  error: string | null = null;
  selectedImage: string | null = null;
  selectedFile: File | null = null;
  showEmojiPicker: boolean = false;
  locationText: string | null = null;
  locationLoading: boolean = false;
  selectedPost: ISocialPost | null = null;
  showCommentsModal = false;
  newCommentContent: string = '';
  currentUserId: string = '';
  currentUserName: string = '';
  editDialogVisible: boolean = false;
  editingContent: string = '';
  editingPost: ISocialPost | null = null;
  private readonly financialComments: string[] = [
    '台積電今日股價表現強勁，市場信心回升！',
    '美股道瓊指數創新高，帶動全球股市上漲',
    '比特幣價格突破新高點，加密貨幣市場活躍',
    '油價走勢震盪，能源股投資需謹慎',
    'Fed暗示可能降息，金融市場樂觀期待',
    '日圓貶值趨勢持續，出口股受益',
    '科技股財報優於預期，帶動相關產業上漲',
    '房地產市場降溫，建商股承壓',
    '新能源產業政策利多，相關概念股大漲',
    '金價創新高，避險情緒升溫',
    '電動車產業鏈供需穩定，後市看好',
    '半導體產業庫存調節，第四季可望回溫',
    'AI概念股持續發燒，投資人搶進',
    '銀行股受惠於利差擴大，獲利成長可期',
    '原物料價格上漲，通膨壓力增加'
  ];

  constructor(
    private financialService: FinancialService,
    private socialService: SocialService,
    private googleMapsService: GoogleMapsService,
    private authService: AuthService
  ) {
    console.log('Component 初始化');
  }

  ngOnInit() {
    console.log('Component 載入完成');
    this.loadFinancialData();
    this.loadPosts();
    this.initCurrentUser();
  }

  private initCurrentUser() {
    this.authService.getUserId().pipe(take(1)).subscribe({
      next: (memberId: string) => {
        if (!memberId) {
          console.error('未找到會員 ID');
          return;
        }
        this.currentUserId = memberId;
        this.currentUserName = memberId;  // 暫時使用 ID
        console.log('設置 currentUserId:', this.currentUserId);
      },
      error: (error: Error) => {
        console.error('獲取會員 ID 失敗:', error);
      }
    });
  }

  loadPosts() {
    console.log('開始載入貼文');
    this.socialService.getPosts().subscribe({
      next: (response: any) => {
        console.log('收到回應:', response);
        // 處理每個貼文的評論列表
        this.posts = response.map((post: ISocialPost) => ({
          ...post,
          commentList: post.commentList?.map(comment => ({
            ...comment,
            userAvatar: `https://api.dicebear.com/7.x/lorelei/svg?seed=${comment.fMemberId}`
          })) || []
        }));
        console.log('設置後的 posts:', this.posts);
      },
      error: (error) => {
        console.error('獲取文章列表失敗:', error);
        this.posts = [];
      }
    });
  }

  private validateComment(comment: any): BackendCommentDTO {
    return {
      fCommentId: comment.fCommentId || 0,
      fMemberId: comment.fMemberId || '',
      fContent: comment.fContent || '',
      fCratedAT: comment.fCratedAT || new Date().toISOString(),
      fPostId: comment.fPostId || 0,
      fUpdateAt: comment.fUpdateAt || new Date().toISOString(),
      userAvatar: `https://api.dicebear.com/7.x/lorelei/svg?seed=${comment.fMemberId}`
    };
  }

  createPost() {
    if (this.newPostContent.trim()) {
      const newPost: ISocialPost = {
        fPostId: 0,
        fUserName: '小資理財家',
        fMemberId: '1',
        fPostContent: this.newPostContent,
        fMemberType: 'U',
        fLikes: 0,
        fCreatedTime: new Date().toISOString(),
        isLiked: false,
        comments: 0,
        commentList: [],
        userAvatar: `https://api.dicebear.com/7.x/lorelei/svg?seed=${this.currentUserId}`,
        reposts: 0
      };

      this.socialService.createPost(newPost).subscribe({
        next: (response) => {
          if (response.success) {
            const createdPost = response.data;
            this.posts.unshift(createdPost);
            this.newPostContent = '';
          }
        },
        error: (error) => {
          console.error('Error creating post:', error);
        },
      });
    }
  }

  likePost(post: ISocialPost) {
    if (post.isLiked) {
      post.fLikes = (post.fLikes || 0) - 1;
    } else {
      post.fLikes = (post.fLikes || 0) + 1;
    }
    post.isLiked = !post.isLiked;
  }

  addComment(post: ISocialPost) {
    if (post.newComment?.trim()) {
      const comment: BackendCommentDTO = {
        fCommentId: 0,
        fMemberId: '小資理財家',
        fContent: post.newComment,
        fCratedAT: new Date().toISOString(),
        fPostId: post.fPostId,
        fUpdateAt: new Date().toISOString(),
        userAvatar: `https://api.dicebear.com/7.x/lorelei/svg?seed=${post.fMemberId}`
      };

      post.commentList = post.commentList || [];
      post.commentList.push(comment);
      post.comments = (post.comments || 0) + 1;
      post.newComment = '';
    }
  }

  loadFinancialData(): void {
    this.isLoading = true;
    this.error = null;

    const symbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'META'];

    forkJoin({
      stocks: this.financialService.getMultipleStocks(symbols),
      news: this.financialService.getMarketNews(),
    }).subscribe({
      next: (data) => {
        this.stockData = data.stocks;
        this.newsData = data.news.news;
        this.isLoading = false;
      },
      error: (error: Error) => {
        console.error('Error loading financial data:', error);
        this.error = error.message;
        this.isLoading = false;
      },
    });
  }

  formatDate(timestamp: number | string | undefined): string {
    if (!timestamp) return '';

    // 如果是數字（Unix timestamp），需要轉換為毫秒
    if (typeof timestamp === 'number') {
      // 如果是秒為單位，轉換為毫秒
      const milliseconds = timestamp * 1000;
      return new Date(milliseconds).toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }

    // 如果是字串，直接使用
    return new Date(timestamp).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  formatPriceChange(change: number): string {
    return change > 0 ? `+${change.toFixed(2)}` : change.toFixed(2);
  }

  handleImageUpload(event: any): void {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.selectedImage = null;
  }

  handleFileUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      console.log('File selected:', file.name);
    }
  }

  toggleEmojiPicker(event?: Event): void {
    if (event) {
      event.stopPropagation(); // 防止事件冒泡
    }
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  onEmojiSelect(event: any): void {
    const emoji = event.emoji.native;
    this.newPostContent += emoji;
    this.showEmojiPicker = false;
  }

  async openCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // 這裡可以實現相機預覽和拍照功能
      console.log('Camera accessed:', stream);
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  }

  async getLocation(): Promise<void> {
    if (!navigator.geolocation) {
      console.error('覽器不支援地理位置功能');
      return;
    }

    try {
      this.locationLoading = true;

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;

      try {
        const address = await this.googleMapsService.getAddressFromCoordinates(
          latitude,
          longitude
        );
        this.locationText = `📍 ${address}`;
      } catch (error) {
        console.error('地址轉換失敗:', error);
        this.locationText = `📍 ${latitude}, ${longitude}`;
      }
    } catch (error) {
      console.error('無法獲取位置:', error);
      this.locationText = '無法獲取位置';
    } finally {
      this.locationLoading = false;
    }
  }

  removeLocation(): void {
    this.locationText = null;
  }

  formatAsList(text: string): string[] {
    if (!text) return [];
    return text.split('\n').filter((line) => line.trim().length > 0);
  }
  // @HostListener 是 Angular 的裝飾器，用於監聽宿主元素（在這裡是整個文檔）的件
  // 'document:click' 表示監聽整個文檔的點擊事件
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    // querySelector 是 DOM API 的方法，用於查找符合 CSS 選擇器的第一個元素
    const emojiContainer = document.querySelector('.emoji-container');
    // TypeScript 的類型斷言，將 event.target 轉換為 HTMLElement 類型
    const target = event.target as HTMLElement;
    // 檢查點擊的目標是否在 emoji 容器外
    if (emojiContainer && !emojiContainer.contains(target)) {
      this.showEmojiPicker = false;
    }
  }

  showComments(post: ISocialPost): void {
    console.log('點擊評論按鈕', post);
    // 確保所有評論都有頭像
    this.selectedPost = {
      ...post,
      commentList: post.commentList?.map(comment => ({
        ...comment,
        userAvatar: `https://api.dicebear.com/7.x/lorelei/svg?seed=${comment.fMemberId}`
      })) || []
    };
    this.showCommentsModal = true;
    console.log('showCommentsModal:', this.showCommentsModal);
  }

  closeComments(): void {
    console.log('關閉評論'); // 除錯用
    this.showCommentsModal = false;
    this.selectedPost = null;
    this.newCommentContent = '';
  }

  // 點擊彈出層外部關閉
  @HostListener('document:keydown.escape')
  onEscapePress() {
    this.closeComments();
  }

  toggleLike(post: ISocialPost) {
    post.isLiked = !post.isLiked;
    post.fLikes += post.isLiked ? 1 : -1;
    // TODO: 呼叫 API 更新點讚狀態
  }

  sharePost(post: ISocialPost) {
    // TODO: 實作分享功能
    console.log('分享貼文:', post);
  }

  submitComment() {
    if (!this.selectedPost || !this.newCommentContent.trim()) return;

    const currentTime = new Date().toISOString();
    const newComment: BackendCommentDTO = {
      fCommentId: 0,
      fPostId: this.selectedPost.fPostId,
      fMemberId: this.currentUserId,
      fContent: this.newCommentContent.trim(),
      fCratedAT: currentTime,
      fUpdateAt: currentTime,
      userAvatar: `https://api.dicebear.com/7.x/lorelei/svg?seed=${this.currentUserId}`
    };

    this.socialService.createComment(newComment).subscribe({
      next: (response) => {
        if (response.success) {
          // 使用後端返回的數據，但保留創建時間和頭像
          const savedComment = {
            ...response.data,
            fCratedAT: currentTime,
            fUpdateAt: currentTime,
            userAvatar: `https://api.dicebear.com/7.x/lorelei/svg?seed=${this.currentUserId}`
          };

          if (this.selectedPost) {
            this.selectedPost.commentList = [
              ...this.selectedPost.commentList,
              savedComment
            ];
            this.selectedPost.comments = (this.selectedPost.comments || 0) + 1;

            const postIndex = this.posts.findIndex(p => p.fPostId === this.selectedPost?.fPostId);
            if (postIndex !== -1) {
              this.posts[postIndex].comments = this.selectedPost.comments;
              this.posts[postIndex].commentList = this.selectedPost.commentList;
            }
          }

          this.newCommentContent = '';
        }
      },
      error: (error) => {
        console.error('發表評論失敗:', error);
      }
    });
  }

  isCurrentUser(postMemberId: string): boolean {
    if (!this.currentUserId || !postMemberId) {
      return false;
    }
    return this.currentUserId === postMemberId;
  }

  editPost(post: ISocialPost): void {
    this.editingPost = post;
    this.editingContent = post.fPostContent;
    this.editDialogVisible = true;
  }

  cancelEdit(): void {
    this.editDialogVisible = false;
    this.editingContent = '';
    this.editingPost = null;
  }

  saveEdit(): void {
    if (!this.editingPost || !this.editingContent.trim()) {
      return;
    }

    const updatedPost = {
      ...this.editingPost,
      fPostContent: this.editingContent.trim()
    };

    this.socialService.updatePost(updatedPost.fPostId, updatedPost).subscribe({
      next: (response) => {
        if (response.success) {
          const index = this.posts.findIndex(p => p.fPostId === updatedPost.fPostId);
          if (index !== -1) {
            this.posts[index] = {
              ...this.posts[index],
              fPostContent: this.editingContent.trim()
            };
          }
          this.editDialogVisible = false;
          this.editingContent = '';
          this.editingPost = null;
        }
      },
      error: (error: Error) => {
        console.error('更新貼文失敗:', error);
      }
    });
  }

  deletePost(post: ISocialPost): void {
    if (confirm('確定要刪除這篇貼文嗎？')) {
      this.socialService.deletePost(post.fPostId).subscribe({
        next: () => {
          this.posts = this.posts.filter(p => p.fPostId !== post.fPostId);
        },
        error: (err: Error) => {
          console.error('刪除貼文失敗:', err);
        }
      });
    }
  }

  submitPost(): void {
    if (!this.newPostContent.trim()) {
      console.error('貼文內容不能為空');
      return;
    }

    if (!this.currentUserId) {
      console.error('用戶 ID 不能為空');
      return;
    }

    const newPost: PostWithImage = {
      fPostId: 0,
      fMemberId: this.currentUserId,
      fUserName: this.currentUserName,
      fPostContent: this.newPostContent.trim(),
      fMemberType: 'U',
      fLikes: 0,
      fCreatedTime: new Date().toISOString(),
      comments: 0,
      commentList: [],
      isLiked: false,
      userAvatar: `https://api.dicebear.com/7.x/lorelei/svg?seed=${this.currentUserId}`,
      reposts: 0,
      selectedImage: this.selectedImage  // 添加圖片
    };

    this.socialService.createPost(newPost).subscribe({
      next: (response) => {
        if (response.success) {
          const postWithImage: PostWithImage = {
            ...response.data,
            userAvatar: `https://api.dicebear.com/7.x/lorelei/svg?seed=${this.currentUserId}`,
            selectedImage: this.selectedImage  // 保持圖片顯示
          };
          this.posts.unshift(postWithImage);
          this.resetPostForm();
        }
      },
      error: (error) => {
        console.error('發文失敗:', error);
      }
    });
  }

  // 新增重置表單方法
  private resetPostForm(): void {
    this.newPostContent = '';
    this.selectedImage = null;
    this.locationText = null;
    this.showEmojiPicker = false;
  }

  // 添加錯誤處理方法
  handleImageError(event: any) {
    event.target.style.display = 'none';
  }

  // 修改發送隨機評論的方法
  sendRandomComment(): void {
    const randomIndex = Math.floor(Math.random() * this.financialComments.length);
    this.newPostContent = this.financialComments[randomIndex];
  }
}

