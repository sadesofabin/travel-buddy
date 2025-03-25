const Comment = require("../models/comments");
const { Location } = require("../models/locationdata");
const catchAsync = require("../helpers/catchAsync");

const createComment = catchAsync(async (req, res) => {
  const { locationId, userId, text } = req.body;

  // Validate request data
  if (!locationId || !userId || !text) {
    return res
      .status(400)
      .json({ message: "locationId, userId, and text are required" });
  }

  // Check if the location exists
  const location = await Location.findById(locationId);
  if (!location) {
    return res.status(404).json({ message: "Location not found" });
  }

  // Create and save the comment
  const comment = new Comment({
    locationId,
    userId,
    text,
  });
  await comment.save();

  // Push comment ID into location's commentIds array
  location.commentIds.push(comment._id);
  await location.save();

  res.status(201).json({
    message: "Comment created successfully",
    comment,
  });
});

const likeComment = catchAsync(async (req, res) => {
  const { commentId } = req.params;
  const { userId } = req.body;

  // Validate required fields
  if (!commentId || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "commentId and userId are required" });
  }

  // Find the comment
  const comment = await Comment.findById(commentId);
  if (!comment) {
    return res
      .status(404)
      .json({ success: false, message: "Comment not found" });
  }

  // Check if user already liked the comment
  const hasLiked = comment.likes.includes(userId);

  if (hasLiked) {
    // Unlike the comment
    comment.likes.pull(userId);
  } else {
    // Like the comment
    comment.likes.push(userId);
  }

  await comment.save();

  res.status(200).json({
    success: true,
    message: hasLiked ? "Comment unliked" : "Comment liked",
    likesCount: comment.likes.length,
  });
});

const addReply = catchAsync(async (req, res) => {
  const { commentId } = req.params;
  const { userId, text } = req.body;

  // Validate required fields
  if (!commentId || !userId || !text) {
    return res.status(400).json({
      success: false,
      message: "commentId, userId, and text are required",
    });
  }

  // Find the comment
  const comment = await Comment.findById(commentId);
  if (!comment) {
    return res
      .status(404)
      .json({ success: false, message: "Comment not found" });
  }

  // Create the reply object
  const reply = {
    userId,
    text,
    likes: [],
    createdAt: new Date(),
  };

  // Add the reply to the comment
  comment.replies.push(reply);
  await comment.save();

  res.status(201).json({
    success: true,
    message: "Reply added successfully",
    reply,
  });
});

const likeReply = catchAsync(async (req, res) => {
  const { commentId, replyId } = req.params;
  const { userId } = req.body;

  // Validate required fields
  if (!commentId || !replyId || !userId) {
    return res.status(400).json({
      success: false,
      message: "commentId, replyId, and userId are required",
    });
  }

  // Find the comment
  const comment = await Comment.findById(commentId);
  if (!comment) {
    return res
      .status(404)
      .json({ success: false, message: "Comment not found" });
  }

  // Find the reply within the comment
  const reply = comment.replies.id(replyId);
  if (!reply) {
    return res.status(404).json({ success: false, message: "Reply not found" });
  }

  // Check if the user has already liked the reply
  const hasLiked = reply.likes.includes(userId);

  if (hasLiked) {
    // Unlike the reply
    reply.likes.pull(userId);
  } else {
    // Like the reply
    reply.likes.push(userId);
  }

  // Save the updated comment
  await comment.save();

  res.status(200).json({
    success: true,
    message: hasLiked ? "Reply unliked" : "Reply liked",
    likesCount: reply.likes.length,
  });
});

const getCommentsByPlaceId = catchAsync(async (req, res) => {
  const { placeId } = req.params;

  // Validate placeId
  if (!placeId) {
    return res
      .status(400)
      .json({ success: false, message: "placeId is required" });
  }

  // Fetch comments with user details, likes, and replies populated
  const comments = await Comment.find({ locationId: placeId })
    .populate("userId", "name profilePicture") // Populate comment owner details
    .populate("likes", "name profilePicture") // Populate users who liked the comment
    .populate({
      path: "replies.userId",
      select: "name profilePicture", // Populate user details for replies
    })
    .populate({
      path: "replies.likes",
      select: "name profilePicture", // Populate users who liked the replies
    });

  // If no comments found
  if (!comments.length) {
    return res
      .status(404)
      .json({ success: false, message: "No comments found for this place" });
  }

  res.status(200).json({
    success: true,
    comments,
  });
});

module.exports = {
  createComment,
  likeComment,
  addReply,
  likeReply,
  getCommentsByPlaceId,
};
