const express = require("express");
const {
  addComment,
  likeComment,
} = require("@controllers/user.controller/comment.controller");

const router = express.Router();

router.post("/add", addComment);
router.post("/like/:commentId", likeComment);

module.exports = router;
