const express = require("express");
const router = express.Router();

const {
  getCompanyNews,
} = require("../controllers/newsController");

router.get("/:company", getCompanyNews);

module.exports = router;