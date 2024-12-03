export interface NewsItem {

  title: string;
  link: string;
  publisher: string;
  providerPublishTime: number;
  type: string;

  thumbnail?: {
    resolutions: Array<{
      url: string;
      width: number;
      height: number;
    }>;
  };
}

// 更新 StockItem 介面以匹配 Yahoo Finance 的回傳資料
export interface StockItem {
  symbol: string;
  shortName?: string;
  currency?: string;
  regularMarketPrice?: number;
  regularMarketChange?: number;
  regularMarketChangePercent?: number;
  regularMarketTime?: Date;
  marketState?: string;
}

export interface MenuItem {
  icon: string;
  label: string;
  active: boolean;
}

export interface FinancialData {
  stocks: StockItem[];
  news: NewsItem[];
}
