const {
  addComment,
  likeComment,
  addReply,
  likeReplay,
  getCommentsByLocationId,
} = require("../../repository/user.repository/comment.repository");

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

const addReplyService = async (data) => {
  const response = await addReply(data);
  if (response === "NOTFOUND") {
    const error = new Error("Comment not found");
    error.statusCode = 404;
    throw error;
  }
  return response;
};

const likeReplyService = async (data) => {
  const response = await likeReplay(data);
  if (response === "COMMENTNOTFOUND") {
    const error = new Error("Comment not found");
    error.statusCode = 404;
    throw error;
  }
  if (response === "REPLAYNOTFOUND") {
    const error = new Error("Replay not found");
    error.statusCode = 404;
    throw error;
  }
  return response;
};

const getCommentsService = async (locationId) => {
  const response = await getCommentsByLocationId(locationId);
  if (response === "NOTFOUND") {
    const error = new Error("Location not found");
    error.statusCode = 404;
    throw error;
  }

  if (response.length === 0) {
    const error = new Error("Comments Not Found");
    error.statusCode = 404;
    throw error;
  }
  return response;
};
module.exports = {
  addCommentService,
  likeCommentService,
  addReplyService,
  likeReplyService,
  getCommentsService,
};
