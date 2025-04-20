const express = require("express");
const {
  addUser,
  getUserById,
  getAllUsers,
} = require("@controllers/user.controller/user.controller");
const { validate } = require("@middlewares/validator.middleware");
const {
  createUserValidator,
  userIdValidator,
} = require("@validator/user.validator/user.validator");

const router = express.Router();

router.post("/add", validate(createUserValidator), addUser);
router.get("/profile/:userId", validate(userIdValidator), getUserById);
router.get("/getAll", getAllUsers);

module.exports = router;
