import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../login-helper/services/auth.service';
import { SocialService } from '../../services/social.service';
import { take } from 'rxjs/operators';
import { ISocialPost } from '../../models/social.interface';
import { IMember } from '../../models/member.interface';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss']
})
export class PersonComponent implements OnInit {
  member: IMember | null = null;
  activeTab: string = '個人文章';
  userPosts: ISocialPost[] = [];
  months = ['一月', '二月', '三月', '四月', '五月', '六月',
           '七月', '八月', '九月', '十月', '十一月', '十二月'];
  performanceData = [
    {
      year: '2024',
      values: [-4.24, 8.44, -0.94, -2.18, 7.04, 4.01, 5.98, 1.59, 7.83, 1.74, 7.38, 0],
      total: 42.06
    },
    {
      year: '2023',
      values: [13.76, -1.20, 2.12, -1.85, 0.30, 5.29, 1.96, -4.77, -2.56, -1.79, 9.93, 3.43],
      total: 25.68
    },
    {
      year: '2022',
      values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3.21, -5.92],
      total: -2.90
    }
  ];
  chartData: any;
  chartOptions: any;
  followerChartData: any;
  followerChartOptions: any;
  tradingData: any;
  tradingOptions: any;
  portfolioData = [
    {
      symbol: 'PFE',
      name: 'Pfizer',
      icon: 'https://logo.clearbit.com/pfizer.com',
      type: '買入',
      investment: 12.31,
      profit: -16.37,
      profitRate: 10.03,
      sellPrice: 26.68,
      buyPrice: 26.79
    },
    {
      symbol: 'DIS',
      name: 'Walt Disney',
      icon: 'https://logo.clearbit.com/disney.com',
      type: '買入',
      investment: 10.80,
      profit: 3.53,
      profitRate: 10.90,
      sellPrice: 102.55,
      buyPrice: 102.91
    },
    {
      symbol: 'AAPL',
      name: 'Apple',
      icon: 'https://logo.clearbit.com/apple.com',
      type: '買入',
      investment: 10.40,
      profit: 1.51,
      profitRate: 10.29,
      sellPrice: 224.89,
      buyPrice: 225.59
    },
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      icon: 'https://logo.clearbit.com/bitcoin.org',
      type: '買入',
      investment: 9.83,
      profit: 33.10,
      profitRate: 12.75,
      sellPrice: 90061.34,
      buyPrice: 91921.11
    },
    {
      symbol: 'META',
      name: 'Meta Platforms Inc',
      icon: 'https://logo.clearbit.com/meta.com',
      type: '買入',
      investment: 6.93,
      profit: 2.84,
      profitRate: 6.95,
      sellPrice: 579.34,
      buyPrice: 581.16
    },
    {
      symbol: 'NVDA',
      name: 'NVIDIA Corporation',
      icon: 'https://logo.clearbit.com/nvidia.com',
      type: '買入',
      investment: 6.93,
      profit: 8.93,
      profitRate: 7.36,
      sellPrice: 146.28,
      buyPrice: 146.77
    },
    {
      symbol: 'MCD',
      name: 'McDonald\'s',
      icon: 'https://logo.clearbit.com/mcdonalds.com',
      type: '買入',
      investment: 4.56,
      profit: -0.15,
      profitRate: 4.44,
      sellPrice: 296.89,
      buyPrice: 297.95
    },
    {
      symbol: 'TSLA',
      name: 'Tesla Motors, Inc.',
      icon: 'https://logo.clearbit.com/tesla.com',
      type: '買入',
      investment: 0.73,
      profit: 2.13,
      profitRate: 0.73,
      sellPrice: 329.97,
      buyPrice: 331.18
    }
  ];
  currentUserId: string="";
  editDialogVisible: boolean = false;
  editingContent: string = '';
  editingPost: ISocialPost | null = null;

  constructor(
    private authService: AuthService,
    private socialService: SocialService
  ) {}

  ngOnInit() {
    this.initCurrentUser();
    this.initCharts();
  }

  private initCurrentUser() {
    this.authService.getUserId().pipe(take(1)).subscribe({
      next: (memberId: string) => {
        if (!memberId) {
          console.error('未找到會員 ID');
          return;
        }

        this.currentUserId = memberId;
        this.member = {
          ...this.member,
          userAvatar: `https://api.dicebear.com/7.x/lorelei/svg?seed=${memberId}`
        } as IMember;
        console.log('設置 currentUserId:', this.currentUserId);

        this.socialService.getMemberData(memberId).subscribe({
          next: (data: IMember) => {
            this.member = data;
            this.loadUserPosts(memberId);
          },
          error: (error) => {
            console.error('獲取會員資料失敗:', error);
          }
        });
      },
      error: (error) => {
        console.error('獲取會員 ID 失敗:', error);
      }
    });
  }

  loadUserPosts(memberId: string) {
    this.socialService.getUserPosts(memberId).subscribe({
      next: (posts: ISocialPost[]) => {
        this.userPosts = posts;
        console.log('載入的貼文:', posts);
        console.log('當前用戶ID:', this.currentUserId);
        posts.forEach(post => {
          console.log(`貼文ID: ${post.fPostId}, 作者ID: ${post.fMemberId}, 是否匹配: ${this.currentUserId === post.fMemberId}`);
        });
      },
      error: (error) => {
        console.error('獲取用戶文章失敗:', error);
      }
    });
  }

  formatDate(timestamp: string | number): string {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  toggleLike(post: ISocialPost) {
    post.isLiked = !post.isLiked;
    post.fLikes += post.isLiked ? 1 : -1;
  }

  showComments(post: ISocialPost) {
    console.log('顯示評論:', post);
  }

  sharePost(post: ISocialPost) {
    console.log('分享貼文:', post);
  }

  private initCharts() {
    this.chartData = {
      labels: this.months,
      datasets: this.performanceData.map(yearData => ({
        label: yearData.year,
        data: yearData.values,
        backgroundColor: yearData.values.map(value =>
          value >= 0 ? 'rgba(75, 192, 75, 0.8)' : 'rgba(255, 99, 132, 0.8)'
        )
      }))
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value: any) {
              return value + '%';
            }
          }
        }
      },
      plugins: {
        legend: {
          display: false
        }
      },
      layout: {
        padding: {
          left: 10,
          right: 10,
          top: 10,
          bottom: 10
        }
      }
    };

    this.followerChartData = {
      labels: ['', '', '', '', '', '', '', '', '', '', '', ''],
      datasets: [{
        label: '複製者',
        data: [0, 0, 0, 0, 0, 8, 15, 25, 45, 82, 120, 182],
        borderColor: '#2196F3',
        tension: 0.4,
        fill: false
      }]
    };

    this.followerChartOptions = {
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };

    this.tradingData = {
      labels: ['股票', '加密貨幣'],
      datasets: [{
        data: [89.41, 10.59],
        backgroundColor: ['#2196F3', '#FF4081']
      }]
    };

    this.tradingOptions = {
      cutout: '60%',
      plugins: {
        legend: {
          display: false
        }
      }
    };
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
      fPostContent: this.editingContent.trim(),
      fPostId: this.editingPost.fPostId,
      fMemberId: this.editingPost.fMemberId,
      fUserName: this.editingPost.fUserName,
      fMemberType: this.editingPost.fMemberType,
      fLikes: this.editingPost.fLikes,
      fCreatedTime: this.editingPost.fCreatedTime
    };

    this.socialService.updatePost(updatedPost.fPostId, updatedPost).subscribe({
      next: (response) => {
        if (response.success) {
          const index = this.userPosts.findIndex(p => p.fPostId === updatedPost.fPostId);
          if (index !== -1) {
            this.userPosts[index] = {
              ...this.userPosts[index],
              fPostContent: this.editingContent.trim()
            };
          }
          this.editDialogVisible = false;
          this.editingContent = '';
          this.editingPost = null;
        } else {
          console.error('更新貼文失敗:', response.message);
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
          this.userPosts = this.userPosts.filter(p => p.fPostId !== post.fPostId);
        },
        error: (err: Error) => {
          console.error('刪除貼文失敗:', err);
        }
      });
    }
  }
}
