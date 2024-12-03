import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of, switchMap } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BackendCommentDTO, ISocialPost } from '../models/social.interface';
import { IMember } from '../models/member.interface';

@Injectable({
  providedIn: 'root',
})
export class SocialService {
  private apiUrl = 'https://localhost:7012/api/Posts';

  constructor(private http: HttpClient) {}

  private getMemberAvatar(memberId: string): string {
    return `https://api.dicebear.com/7.x/lorelei/svg?seed=${memberId}&backgroundColor=ffdfbf,ffd5dc,c0aede,b6e3f4&mood=happy,blissful&size=128`;
  }

  getPosts(): Observable<ISocialPost[]> {
    return this.http.get<any>(`${this.apiUrl}`).pipe(
      map(posts => posts.map((post: any) => ({
        ...post,
        userAvatar: this.getMemberAvatar(post.fMemberId)
      })))
    );
  }

  getUserPosts(memberId: string): Observable<ISocialPost[]> {
    return this.http.get<any>(`https://localhost:7012/api/person/posts/${memberId}`).pipe(
      map(posts => posts.map((post: any) => ({
        ...post,
        userAvatar: this.getMemberAvatar(post.fMemberId)
      })))
    );
  }

  createPost(post: ISocialPost): Observable<any> {
    if (!post.fMemberId || !post.fPostContent) {
      return throwError(() => new Error('必要欄位不能為空'));
    }

    return this.getMemberData(post.fMemberId).pipe(
      switchMap(memberData => {
        const postToSend = {
          FMemberId: post.fMemberId,
          FUserName: memberData.fUserName,
          FPostContent: post.fPostContent
        };

        console.log('發送的貼文資料:', postToSend);
        return this.http.post<any>(`${this.apiUrl}/create`, postToSend);
      })
    );
  }

  updatePost(id: number, post: ISocialPost): Observable<any> {
    const tPost = {
      fPostId: post.fPostId,
      fMemberId: post.fMemberId,
      fUserName: post.fUserName,
      fPostContent: post.fPostContent,
      fMemberType: post.fMemberType,
      fLikes: post.fLikes,
      fCreatedTime: post.fCreatedTime ? new Date(post.fCreatedTime) : null,
      fParentCommentId: null
    };

    return this.http.put<any>(`${this.apiUrl}/${id}`, tPost).pipe(
      map(response => {
        if (response.success) {
          return response;
        } else {
          throw new Error(response.message);
        }
      }),
      catchError(error => {
        console.error('更新貼文時發生錯誤:', error);
        return throwError(() => error);
      })
    );
  }

  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getMemberData(memberId: string): Observable<any> {
    return this.http.get<any>(`https://localhost:7012/api/person/member/${memberId}`);
  }

  searchPosts(query: string): Observable<ISocialPost[]> {
    return this.http.get<any>(`https://localhost:7012/api/search/posts?q=${query}`).pipe(
      map(posts => posts.map((post: any) => ({
        ...post,
        userAvatar: this.getMemberAvatar(post.fMemberId)
      })))
    );
  }

  createComment(comment: BackendCommentDTO): Observable<any> {
    const commentToSend = {
      fCommentId: comment.fCommentId,
      fPostId: comment.fPostId,
      fMemberId: comment.fMemberId,
      fContent: comment.fContent,
      fCratedAT: comment.fCratedAT,
      fUpdateAt: comment.fUpdateAt
    };

    return this.http.post<any>(`https://localhost:7012/api/Comments`, commentToSend).pipe(
      map(response => {
        if (response.success) {
          return response;
        } else {
          throw new Error(response.message);
        }
      }),
      catchError(error => {
        console.error('新增評論時發生錯誤:', error);
        return throwError(() => error);
      })
    );
  }

  private checkBackendConnection(): Observable<boolean> {
    return this.http.get<any>(`${this.apiUrl}/health`).pipe(
      map(() => true),
      catchError(() => {
        console.error('後端服務未啟動或無法連接');
        return of(false);
      })
    );
  }
}
