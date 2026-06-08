const axios = require("axios");

const getCompanyNews = async (req, res) => {
  try {
    const company = req.params.company;

    const response = await axios.get(
      `https://newsapi.org/v2/everything?q=${company}&language=en&sortBy=publishedAt&apiKey=${process.env.NEWS_API_KEY}`
    );

    res.json(response.data.articles);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getCompanyNews,
};