const express = require("express");
const {
  addNews,
  getNews,
} = require("@controllers/user.controller/newsandevents.controller");

const router = express.Router();

router.post("/add", addNews);
router.get("/get", getNews);


module.exports = router;
