const express = require("express");
const { addUser } = require("@controllers/user.controller/user.controller");
const { validate } = require("@middlewares/validator.middleware");
const {
  createUserValidator,
} = require("@validator/user.validator/user.validator");

const router = express.Router();

router.post("/add", validate(createUserValidator), addUser);

module.exports = router;
