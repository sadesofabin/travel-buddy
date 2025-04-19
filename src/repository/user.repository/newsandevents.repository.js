const News = require("../../models/newsandevents");

const newsAndEventsRepository = {
  async addNews(data) {
    const response = await News.create(data);
    return response;
  },


};

module.exports = newsAndEventsRepository;
