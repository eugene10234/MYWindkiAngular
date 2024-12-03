

// 然後使用該介面
export const environment = {
  production: true,
  alphavantage: {
    apiKey: 'U8UGOT9MJSSG5SPK',
    baseUrl: 'https://www.alphavantage.co/query'
  },
  googleMaps: {
    production: true,
    apiKey: 'AIzaSyAVCDcCRj_MRVQmZ9a2afJF8AM1MIdFmLc'
  },
  backend: {
    apiUrl: 'https://localhost:7012'
  },
  server: {
    baseUrl: 'https://localhost:7012/api'
  },

  fugle: {
    apiKey: 'NWM0MjE1NGEtYWQyMi00ODU2LWEyMDYtNDZmNzU5YjczOGQ5IGU0ZGVkNDgyLWZlNTQtNGNmYi1iYWM5LTllZTQwY2E2MzRlOA==', // 用您的 Fugle API 金鑰替換
    baseUrl: 'https://api.fugle.tw/marketdata/v1.0/stock/intraday/quote/'
},

  chatgpt: {
    production: false,
    apiKey: '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'
  },
  fugleMarket: {
    apiKey: 'NmZlYzYyNGYtMjg1Yi00NjRmLTkwYjYtNWZhMTlhZjY3NzFmIGFiNjMzYzVmLWI1OGYtNDQ0OS1hZjczLWJjYjM0ODI1ZWFiOA==',
    fugleApiBase: 'wss://api.fugle.tw/marketdata/v1.0/stock/streaming',
  },

  fugleRank: {
    apiKey: 'NmZlYzYyNGYtMjg1Yi00NjRmLTkwYjYtNWZhMTlhZjY3NzFmIGFiNjMzYzVmLWI1OGYtNDQ0OS1hZjczLWJjYjM0ODI1ZWFiOA==',
    fugleApiBase: 'https://api.fugle.tw/marketdata/v1.0/stock/snapshot/quotes/',


}}
