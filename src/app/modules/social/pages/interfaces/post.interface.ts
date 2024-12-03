/**
 * 定義貼文的介面結構
 * @interface Post
 * @property {number} id - 貼文唯一識別碼
 * @property {string} userName - 發文者名稱
 * @property {string} timePosted - 發文時間
 * @property {string} content - 貼文內容
 * @property {number} likes - 按讚數量
 * @property {number} comments - 評論數量
 * @property {boolean} isLiked - 是否按讚
 * @property {string} userAvatar - 使用者頭像
 * @property {string[]} images - 貼文圖片
 * @property {Comment[]} commentList - 評論列表
 * @property {string} newComment - 新評論內容
 */
export interface Post {
  id: number;
  userName: string;
  timePosted: string;
  content: string;
  likes: number;
  comments: number;
  isLiked?: boolean;
  userAvatar?: string;
  images?: string[];
  commentList?: Comment[];
  newComment?: string;
}

/**
 * 定義選單項目的介面結構
 * @interface MenuItem
 * @property {string} icon - 選單項目圖示
 * @property {string} label - 選單項目文字
 * @property {boolean} active - 選單項目是否被選中
 */
export interface MenuItem {
  icon: string;
  label: string;
  active: boolean;
}

interface Comment {
  userName: string;
  text: string;
  time: string;
}
