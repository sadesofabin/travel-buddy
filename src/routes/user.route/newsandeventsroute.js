const express = require("express");
const {
  addNews,
} = require("@controllers/user.controller/newsandevents.controller");

const router = express.Router();

router.post("/add", addNews);

module.exports = router;
