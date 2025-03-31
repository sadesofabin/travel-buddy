const bcrypt = require("bcryptjs");
const {
  addUser,
  getUserById,
  getAllusers,
  calculatePagination,
} = require("../../repository/user.repository/user.repository");

const addUserService = async (data) => {
  const salt = await bcrypt.genSalt(10);
  data.password = await bcrypt.hash(data.password, salt);

  if (data.dob) {
    const [day, month, year] = data.dob.split("-");
    data.dob = new Date(`${year}-${month}-${day}`);
  } else {
    data.dob = null;
  }
  await addUser(data);
  return "sucess";
};

const getUserByIdService = async (userId) => {
  return await getUserById(userId);
};

const getAllUserService = async (page, limit) => {
  const { totalUsers, totalPages, skip } =
    await calculatePagination(page, limit);
  const users = await getAllusers(skip, limit);
  return { totalUsers, totalPages, users };
};

module.exports = {
  addUserService,
  getUserByIdService,
  getAllUserService,
};
