const {
    addNews
} = require("../../repository/user.repository/newsandevents.repository");

const addNewsService = async (data) => {
    return await addNews(data);
 };


module.exports = {
    addNewsService,
};
