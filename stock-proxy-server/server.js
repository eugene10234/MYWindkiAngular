const express = require('express');
const yahooFinance = require('yahoo-finance2').default;
const cors = require('cors');

const app = express();
app.use(cors()); // 允許所有來源的跨域請求

// 定義取得股票價格資料的 API 路由
app.get('/api/stock/:symbol', async (req, res) => {
  try {
    const symbol = req.params.symbol; // 從 URL 取得股票代碼，例如 "AAPL" 或 "TSLA"
    const quote = await yahooFinance.quote(symbol); // 使用 Yahoo Finance API 取得即時數據

    // 返回股票代碼、價格、名稱等資料
    res.json({
      symbol: quote.symbol,
      price: quote.regularMarketPrice,
      name: quote.longName,
    });
  } catch (error) {
    console.error('Error fetching stock data:', error);
    res.status(500).json({ error: 'Failed to fetch stock data' });
  }
});

// 啟動伺服器並監聽在指定的埠
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
