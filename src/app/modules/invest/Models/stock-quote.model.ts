import { Time } from "@angular/common";

// src/app/models/stock-quote.model.ts
export interface StockQuote {
  date: string; // 日期（可能是 ISO 格式字符串）
  type: string; // 類型，例如 EQUITY
  exchange: string; // 交易所，例如 TWSE
  market: string; // 市場別
  symbol: string; // 股票代號
  name: string; // 股票名稱
  referencePrice: number; // 參考價
  previousClose: number; // 前收價
  openPrice: number; // 開盤價
  openTime: number; // 開盤時間（UNIX 微秒或毫秒）
  highPrice: number; // 最高價
  highTime: number; // 最高價時間（UNIX 微秒或毫秒）
  lowPrice: number; // 最低價
  lowTime: number; // 最低價時間（UNIX 微秒或毫秒）
  closePrice: number; // 收盤價
  closeTime: number; // 收盤時間（UNIX 微秒或毫秒）
  avgPrice: number; // 平均價
  change: number; // 漲跌
  changePercent: number; // 漲跌百分比
  amplitude: number; // 振幅
  lastPrice: number; // 最新價
  lastSize: number; // 最新成交量
  bids: Bid[]; // 買盤
  asks: Ask[]; // 賣盤
  total: Total; // 總數據
  lastTrade: LastTrade; // 最新成交
  lastTrial: LastTrial; // 最新試算
  isClose: boolean; // 是否收盤
  serial: number; // 序列號
  lastUpdated: number; // 最後更新時間（UNIX 微秒或毫秒）
}

export interface Bid {
  price: number; // 買盤價格
  size: number; // 買盤數量
}

export interface Ask {
  price: number; // 賣盤價格
  size: number; // 賣盤數量
}

export interface Total {
  tradeValue: number; // 總交易金額
  tradeVolume: number; // 總交易量
  tradeVolumeAtBid: number; // 買盤總交易量
  tradeVolumeAtAsk: number; // 賣盤總交易量
  transaction: number; // 成交數量
  time: number; // 總數據時間（UNIX 微秒或毫秒）
}

export interface LastTrade {
  bid: number; // 最新成交買盤價
  ask: number; // 最新成交賣盤價
  price: number; // 最新成交價
  size: number; // 最新成交數量
  time: number; // 最新成交時間（UNIX 微秒或毫秒）
  serial: number; // 最新成交序列號
}

export interface LastTrial {
  bid: number; // 最新試算買盤價
  ask: number; // 最新試算賣盤價
  price: number; // 最新試算成交價
  size: number; // 最新試算成交數量
  time: number; // 最新試算時間（UNIX 微秒或毫秒）
  serial: number; // 最新試算序列號
}
