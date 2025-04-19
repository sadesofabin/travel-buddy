const catchAsync = require("../../helpers/catchAsync");
const {
  addNewsService
} = require("../../services/user.services/newsandevents.service");

const addNews = catchAsync(async (req, res) => {
  await addNewsService(req.body);
  res
    .status(201)
    .json({ sucess: true, status: 201, message: "New and Event added successfully" });
});


module.exports = { addNews};
