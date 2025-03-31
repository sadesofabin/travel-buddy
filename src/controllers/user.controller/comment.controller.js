const catchAsync = require("../../helpers/catchAsync");
const {
  addCommentService,
  likeCommentService,
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

module.exports = { addComment, likeComment };
