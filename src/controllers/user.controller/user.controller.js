const catchAsync = require("../../helpers/catchAsync");
const {
  addUserService,
  getUserByIdService,
  getAllUserService
} = require("../../services/user.services/user.service");

const addUser = catchAsync(async (req, res) => {
  await addUserService(req.body);
  res
    .status(201)
    .json({ sucess: true, status: 201, message: "user added successfully" });
});

const getUserById = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const user = await getUserByIdService(userId);
  res.status(200).json({ sucess: true, status: 200, user });
});

const getAllUsers = catchAsync(async (req, res) => {
  const { limit,page } = req.query;
  const user = await getAllUserService(page, limit);
  res.status(200).json({ sucess: true, status: 200, user });
});

module.exports = { addUser, getUserById, getAllUsers };
