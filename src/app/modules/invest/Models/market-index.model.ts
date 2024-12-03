export interface MarketIndex {
  symbol: string;     // 股票指數代號
  type: string;       // 指數類型 (INDEX)
  exchange: string;   // 交易所 (TWSE)
  index: number;      // 指數值
  time: number;       // 資料時間戳記 (UNIX Timestamp)
  formattedTime?: string; // 顯示格式化後的時間
}
