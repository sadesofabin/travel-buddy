const catchAsync = require("../../helpers/catchAsync");
const { addUserService } = require("../../services/user.services/user.service");

const addUser = catchAsync(async (req, res) => {
  const newUser = await addUserService(req.body);
  res
    .status(201)
    .json({ sucess: true, status: 201, message: "user added successfully" });
});

module.exports = { addUser };
