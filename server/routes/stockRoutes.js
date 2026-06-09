const express = require("express");
const router = express.Router();
console.log("Stock routes loaded");
const {
  getStockData,
} = require("../controllers/stockController");

router.get("/:symbol", getStockData);

module.exports = router;