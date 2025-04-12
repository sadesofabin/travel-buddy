const express = require("express");
const {
    userLogin
} = require("@controllers/auth.controller/auth.controller");

const router = express.Router();

router.post("/userLogin", userLogin);

module.exports = router;
