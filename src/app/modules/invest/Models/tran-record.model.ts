export interface TranRecord {
  fTranId?: number;         // 交易編號
  fMemberId: string;       // 會員編號
  fStockId: string;        // 股票代碼
  fBrokerId: string;       // 券商代碼
  fTranType: string;       // 交易類型（如：現股、融資）
  fBuySell: string;        // 買/賣標記（如：買進/賣出）
  fStockQty: number;       // 股票數量
  fStockPrice: number;     // 股票價格
  fTranTime: string;       // 交易時間 (ISO 8601 格式)
}
