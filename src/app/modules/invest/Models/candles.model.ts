export interface Candles {
  symbol: string;    // 股票代號
  type: string;      // 類型
  exchange: string;  // 交易所
  market?: string;   // 市場別
  date: string;      // 日期
  open: number;      // 開盤價
  high: number;      // 最高價
  low: number;       // 最低價
  close: number;     // 收盤價
  volume: number;    // 成交量
  average: number;   // 成交均價
}
