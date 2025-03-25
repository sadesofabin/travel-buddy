const bcrypt = require("bcryptjs");
const { addUser } = require("../../repository/user.repository/user.repository");

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

module.exports = {
  addUserService,
};
