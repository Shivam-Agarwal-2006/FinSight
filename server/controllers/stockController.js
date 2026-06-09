const axios = require("axios");

const getStockData = async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();

    const quoteRes = await axios.get(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`
    );

    const profileRes = await axios.get(
      `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`
    );

    let chartData = [];

    try {
      const historyRes = await axios.get(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=compact&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
      );

      const timeSeries =
        historyRes.data["Time Series (Daily)"];

      if (timeSeries) {
        chartData = Object.entries(timeSeries)
          .slice(0, 30)
          .reverse()
          .map(([date, values]) => ({
            date,
            close: Number(values["4. close"]),
          }));
      }
    } catch (error) {
      console.log(
        "Historical chart unavailable:",
        error.response?.data || error.message
      );
    }

    res.json({
      symbol,
      profile: {
        name: profileRes.data.name,
        ticker: profileRes.data.ticker,
        exchange: profileRes.data.exchange,
        industry: profileRes.data.finnhubIndustry,
        country: profileRes.data.country,
        currency: profileRes.data.currency,
        marketCapitalization: profileRes.data.marketCapitalization,
        ipo: profileRes.data.ipo,
        logo: profileRes.data.logo,
      },
      quote: {
        current: quoteRes.data.c,
        change: quoteRes.data.d,
        percentChange: quoteRes.data.dp,
        high: quoteRes.data.h,
        low: quoteRes.data.l,
        open: quoteRes.data.o,
        previousClose: quoteRes.data.pc,
      },
      chartData,
    });
  } catch (error) {
    console.log(
      "STOCK API ERROR:",
      error.response?.data || error.message
    );

    res.status(500).json({
      message: "Stock data fetch failed",
      error: error.response?.data || error.message,
    });
  }
};

module.exports = {
  getStockData,
};