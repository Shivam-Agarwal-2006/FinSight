const axios = require("axios");

const generateSummary = async (req, res) => {
  try {
    const { text } = req.body;

    const response = await axios.post(
      `${process.env.ML_SERVICE_URL}/summary`,
      { text }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      message: "Summary generation failed",
    });
  }
};

module.exports = {
  generateSummary,
};