const News = require("../../models/newsandevents");

const newsAndEventsRepository = {
  async addNews(data) {
    const response = await News.create(data);
    return response;
  },
  async getNews(skip = 0, limit = 10) {
    const response = await News.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    return response;
  },
  async calculatePagination(page, limit) {
    const totalNews = await News.countDocuments();
    const totalPages = Math.ceil(totalNews / limit);
    const skip = (page - 1) * limit;

    return { totalNews, totalPages, skip };
  },
};

module.exports = newsAndEventsRepository;
