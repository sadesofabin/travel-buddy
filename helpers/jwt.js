const jwt = require("jsonwebtoken");

const generateToken = (userId, email) => {
  return jwt.sign(
    { userId, email },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );
};

module.exports = { generateToken };
