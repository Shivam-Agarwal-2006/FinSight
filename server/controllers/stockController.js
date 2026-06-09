const axios = require("axios");

const getStockData = async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();

    const quoteRes = await axios.get(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`
    );

    res.json({
      symbol,
      quote: {
        current: quoteRes.data.c,
        change: quoteRes.data.d,
        percentChange: quoteRes.data.dp,
        high: quoteRes.data.h,
        low: quoteRes.data.l,
        open: quoteRes.data.o,
        previousClose: quoteRes.data.pc,
      },
    });
  } catch (error) {
    console.log("STOCK API ERROR:", error.response?.data || error.message);

    res.status(500).json({
      message: "Stock data fetch failed",
      error: error.response?.data || error.message,
    });
  }
};

module.exports = {
  getStockData,
};