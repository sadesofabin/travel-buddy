const {
  addNews,
  getNews,
  calculatePagination
} = require("../../repository/user.repository/newsandevents.repository");

const addNewsService = async (data) => {
  return await addNews(data);
};
const getNewsService = async (page, limit) => {
     const { totalNews, totalPages, skip } = await calculatePagination(
        page,
        limit,
      );
  const responce = await getNews(skip, limit);
  if (!responce) {
    const error = new Error("News not found");
    error.statusCode = 404;
    throw error;
  }
  return { totalNews, totalPages, skip, responce };
};

module.exports = {
  addNewsService,
  getNewsService,
};
