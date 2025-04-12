const userRepository = require("../../repository/auth.repository/auth.repository");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../../helpers/jwt");

const loginUser = async (email, password) => {

  const user = await userRepository.login(email);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  if (user.isDeleted) {
    const error = new Error("Your account has been deactivated. Contact support.");
    error.statusCode = 403;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    const error = new Error("Incorrect password");
    error.statusCode = 400;
    throw error;
  }

  const token = generateToken(user._id, user.email);

  return {
    message: "Successfully logged in",
    user: {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      username: user.username,
    },
    token,
  };
};

module.exports = {
  loginUser,
};
