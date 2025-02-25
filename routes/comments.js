const express = require("express");
const router = express.Router();
const { createComment, likeComment, addReply, likeReply ,getCommentsByPlaceId} = require("../controllers/commentController");

router.post("/createComment", createComment);
router.post('/like/:commentId', likeComment);
router.post('/reply/:commentId', addReply);
router.post('/reply-like/:commentId/:replyId', likeReply);
router.get('/listcomments/:placeId', getCommentsByPlaceId);






module.exports = router;
