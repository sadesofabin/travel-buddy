const User = require("../../models/user");
// const { generateToken } = require("../helpers/jwt");


const userRepository = {
  async addUser(data) {
    const { email, username } = data;

    const response = await User.findOne({ $or: [{ email }, { username }] });

    if (response) {
      const error = new Error("Email or username already exists");
      error.statusCode = 400;
      throw error;
    }
    await User.create(data);
    return "sucess";
  },
};

module.exports = userRepository
