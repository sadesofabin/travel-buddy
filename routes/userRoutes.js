const express = require("express");
const { getUsers, createUser, userLogin, getFollowers, getFollowing, getUserById, updateUser  } = require("../controllers/userController");

const router = express.Router();

router.get("/", getUsers);
router.get("/profile/:userId", getUserById);
router.post("/createUser", createUser);
router.post("/login", userLogin);
router.get("/:userId/followers", getFollowers);
router.get("/:userId/following", getFollowing);
router.patch("/edit/:id", updateUser);



module.exports = router;
