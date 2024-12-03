export interface ISocialPost {
  fPostId: number;
  fMemberId: string;
  fUserName: string;
  fPostContent: string;
  fLikes: number;
  fCreatedTime: string;
  fMemberType: string;
  fParentCommentId?: number | null;
  fFinStatement?: any;
  isLiked: boolean;
  userAvatar: string;
  comments: number;
  commentList: BackendCommentDTO[];
  reposts: number;
  newComment?: string;
}

export interface BackendCommentDTO {
  fCommentId: number;
  fPostId: number;
  fMemberId: string;
  fContent: string;
  fCratedAT: string;
  fUpdateAt: string;
  userAvatar?: string;
}

export function isValidSocialPost(post: any): post is ISocialPost {
  return (
    typeof post.fPostId === 'number' &&
    typeof post.fMemberId === 'string' &&
    typeof post.fUserName === 'string' &&
    typeof post.fPostContent === 'string' &&
    typeof post.fLikes === 'number' &&
    typeof post.fCreatedTime === 'string' &&
    typeof post.fMemberType === 'string' &&
    typeof post.isLiked === 'boolean' &&
    typeof post.userAvatar === 'string' &&
    typeof post.comments === 'number' &&
    Array.isArray(post.commentList) &&
    typeof post.reposts === 'number'
  );
}

export function isValidComment(comment: any): comment is BackendCommentDTO {
  return (
    typeof comment.fCommentId === 'number' &&
    typeof comment.fPostId === 'number' &&
    typeof comment.fMemberId === 'string' &&
    typeof comment.fContent === 'string' &&
    typeof comment.fCratedAT === 'string' &&
    typeof comment.fUpdateAt === 'string'
  );
}
