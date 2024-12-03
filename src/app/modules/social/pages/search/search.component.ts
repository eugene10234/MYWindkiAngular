import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { SocialService } from '../../services/social.service';
import { ISocialPost } from '../../models/social.interface';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  searchQuery: string = '';
  searchResults: ISocialPost[] = [];
  userPosts: ISocialPost[] = [];
  private searchSubject = new Subject<string>();

  constructor(private socialService: SocialService) {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(query => {
        this.performSearch(query);
      });
  }

  ngOnInit() {}

  onSearchChange() {
    this.searchSubject.next(this.searchQuery);
  }

  clearSearch() {
    this.searchQuery = '';
    this.searchResults = [];
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

  private performSearch(query: string) {
    if (!query.trim()) {
      this.searchResults = [];
      return;
    }

    this.socialService.searchPosts(query).pipe(take(1)).subscribe({
      next: (results) => {
        this.searchResults = results;
      },
      error: (error) => {
        console.error('搜尋失敗:', error);
      }
    });
  }

  ngOnDestroy() {
    this.searchSubject.complete();
  }
}
