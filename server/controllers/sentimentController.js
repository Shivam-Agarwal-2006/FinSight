const axios = require("axios");

const analyzeSentiment = async (req, res) => {
  try {
    const { text } = req.body;

    const response = await axios.post(
      `${process.env.ML_SERVICE_URL}/sentiment`,
      {
        text,
      }
    );

    res.json(response.data);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Sentiment analysis failed",
    });
  }
};

module.exports = {
  analyzeSentiment,
};