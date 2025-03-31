const { addComment, likeComment } = require("../../repository/user.repository/comment.repository");

const addCommentService = async (data) => {
  const response = await addComment(data);
  if (response === "NOTFOUND") {
    const error = new Error("Location not found");
    error.statusCode = 404;
    throw error;
  }

  if (!response) {
    const error = new Error("Comment not found");
    error.statusCode = 404;
    throw error;
  }
  return "sucess";
};

const likeCommentService = async (data) => {
  const response = await likeComment(data);
  if (response === "NOTFOUND") {
    const error = new Error("Comment not found");
    error.statusCode = 404;
    throw error;
  }
  return response;
};

module.exports = {
  addCommentService,
  likeCommentService
};
