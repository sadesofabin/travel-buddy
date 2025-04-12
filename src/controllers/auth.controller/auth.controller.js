const catchAsync = require("../../helpers/catchAsync");
const userService = require("../../services/auth.services/auth.service");

const userLogin = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const result = await userService.loginUser(email, password);
  return res.status(200).json(result);
});

module.exports = {
  userLogin,
};

