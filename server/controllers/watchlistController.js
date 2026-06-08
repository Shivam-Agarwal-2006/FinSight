const User = require("../models/User");

const addToWatchlist = async (req, res) => {
  try {
    const { company } = req.body;

    const user = await User.findById(req.user.userId);

    if (!user.watchlist.includes(company)) {
      user.watchlist.push(company);
      await user.save();
    }

    res.json(user.watchlist);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getWatchlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    res.json(user.watchlist);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addToWatchlist,
  getWatchlist,
};