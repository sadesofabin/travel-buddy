const User = require("../../models/user");

const login = async (email) => {
  
  return await User.findOne({ email });
};

module.exports = {
  login,
};
