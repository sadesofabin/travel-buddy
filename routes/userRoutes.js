const express = require("express");
const { getUsers, createUser, userLogin, getFollowers, getFollowing } = require("../controllers/userController");

const router = express.Router();

router.get("/", getUsers);
router.post("/createUser", createUser);
router.post("/login", userLogin);
router.get("/:userId/followers", getFollowers);
router.get("/:userId/following", getFollowing);

module.exports = router;
