const catchAsync = require("../../helpers/catchAsync");
const {
  addCommentService,
  likeCommentService,
  addReplyService,
  likeReplyService,
  getCommentsService
} = require("../../services/user.services/comment.service");

const addComment = catchAsync(async (req, res) => {
  await addCommentService(req.body);
  res
    .status(201)
    .json({ sucess: true, status: 201, message: "Comment added successfully" });
});

const likeComment = catchAsync(async (req, res) => {
  const data = { userId: req.body.userId, commentId: req.params.commentId };
  const responce = await likeCommentService(data);
  res.status(200).json({
    sucess: true,
    status: 200,
    message: responce.message,
    likesCount: responce.likesCount,
  });
});

const addReply = catchAsync(async (req, res) => {
  const data = {
    userId: req.body.userId,
    commentId: req.params.commentId,
    text: req.body.text,
  };
  await addReplyService(data);
  res.status(200).json({
    sucess: true,
    status: 200,
    likesCount: "Reply added successfully",
  });
});

const likeReply = catchAsync(async (req, res) => {
  const data = {
    userId: req.body.userId,
    commentId: req.params.commentId,
    replyId: req.params.replyId,
  };
  const responce = await likeReplyService(data);
  res.status(200).json({
    sucess: true,
    status: 200,
    message: responce.message,
    likesCount: responce.likesCount,
  });
});

const getAllCommentsByLocId = catchAsync(async (req, res) => {  
  const comments = await getCommentsService( req.params.locationId);
  res.status(200).json({ sucess: true, status: 200, comments });
});

module.exports = { addComment, likeComment, addReply, likeReply , getAllCommentsByLocId};
