const express = require("express");
const {
  addComment,
  likeComment,
  addReply,
  likeReply,
  getAllCommentsByLocId,
} = require("@controllers/user.controller/comment.controller");

const router = express.Router();

router.post("/add", addComment);
router.post("/like/:commentId", likeComment);
router.post("/reply/:commentId", addReply);
router.post("/:commentId/reply-like/:replyId", likeReply);
router.get("/get/:locationId", getAllCommentsByLocId);

module.exports = router;
