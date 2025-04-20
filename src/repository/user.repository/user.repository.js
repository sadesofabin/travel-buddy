const User = require("../../models/user");

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
    return "success";
  },

  async getUserById(userId) {
    const response = await User.findById(userId).select("-password");

    if (!response) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    return response;
  },

  async getAllusers(skip, limit) {
    const response = await User.find()
      .select("-password")
      .skip(skip)
      .limit(limit);

    if (response.length === 0) {
      const error = new Error("Users not found");
      error.statusCode = 404;
      throw error;
    }
    return response;
  },

  async calculatePagination(page, limit) {
    const totalUsers = await User.countDocuments();
    const totalPages = Math.ceil(totalUsers / limit);
    const skip = (page - 1) * limit;

    return { totalUsers, totalPages, skip };
  },
};

module.exports = userRepository;
