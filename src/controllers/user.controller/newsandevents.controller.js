const catchAsync = require("../../helpers/catchAsync");
const {
  addNewsService, getNewsService
} = require("../../services/user.services/newsandevents.service");

const addNews = catchAsync(async (req, res) => {
  await addNewsService(req.body);
  res
    .status(201)
    .json({ sucess: true, status: 201, message: "New and Event added successfully" });
});

const getNews = catchAsync(async (req, res) => {
   const news = await getNewsService(req.query.page, req.query.limit);
    res
      .status(201)
      .json({ sucess: true, status: 201, news });
  });


module.exports = { addNews, getNews};
