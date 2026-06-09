const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  addToWatchlist,
  getWatchlist,
  removeFromWatchlist
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

router.delete(
  "/:company",
  authMiddleware,
  removeFromWatchlist
);

module.exports = router;