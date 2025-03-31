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
    return {message , likesCount: comment.likes.length};
  },
};

module.exports = commentRepository;
