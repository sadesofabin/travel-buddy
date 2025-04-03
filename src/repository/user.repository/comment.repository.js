const Comment = require("../../models/comments");
const { Location } = require("../../models/locationdata");

const commentRepository = {
  async addComment(data) {
    const location = await Location.findById(data.locationId);
    if (!location) {
      return "NOTFOUND";
    }
    const response = await Comment.create(data);
    return response;
  },

  async likeComment(data) {
    const comment = await Comment.findById(data.commentId);
    if (!comment) {
      return "NOTFOUND";
    }
    const hasLiked = comment.likes.includes(data.userId);

    if (hasLiked) {
      comment.likes.pull(data.userId);
    } else {
      comment.likes.push(data.userId);
    }
    await comment.save();
    const message = hasLiked ? "Comment unliked" : "Comment liked";
    return { message, likesCount: comment.likes.length };
  },
  async addReply(data) {
    const comment = await Comment.findById(data.commentId);
    if (!comment) {
      return "NOTFOUND";
    }

    const reply = {
      userId: data.userId,
      text: data.text,
      likes: [],
      createdAt: new Date(),
    };
    comment.replies.push(reply);
    await comment.save();
    return "sucess";
  },

  async likeReplay(data) {
    const comment = await Comment.findById(data.commentId);
    if (!comment) {
      return "COMMENTNOTFOUND";
    }

    const reply = comment.replies.id(data.replyId);

    if (!reply) {
      return "REPLAYNOTFOUND";
    }

    const hasLiked = reply.likes.includes(data.userId);

    if (hasLiked) {
      reply.likes.pull(data.userId);
    } else {
      reply.likes.push(data.userId);
    }
    await comment.save();
    const message = hasLiked ? "Reply unliked" : "Reply liked";
    return { message, likesCount: comment.likes.length };
  },

  async getCommentsByLocationId(locationId) {
    const location = await Location.findById(locationId);
    if (!location) {
      return "NOTFOUND";
    }
    const response = await Comment.find({ locationId: locationId })
      .populate("userId", "name profilePicture")
      .populate("likes", "name profilePicture")
      .populate({
        path: "replies.userId",
        select: "name profilePicture",
      })
      .populate({
        path: "replies.likes",
        select: "name profilePicture",
      });

    return response;
  },
};

module.exports = commentRepository;
