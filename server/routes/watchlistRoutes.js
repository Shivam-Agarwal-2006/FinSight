const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  addToWatchlist,
  getWatchlist,
} = require("../controllers/watchlistController");

router.get(
  "/",
  authMiddleware,
  getWatchlist
);

router.post(
  "/",
  authMiddleware,
  addToWatchlist
);

module.exports = router;